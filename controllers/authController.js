const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  createUser,
  findUserByUsername,
  updatePasswordInDatabase,
} = require("../models/userModel");

const register = async (req, res) => {
  const { username, password, employeeId } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword, employeeId);
    res.status(201).json({
      message: "Usuario registrado con éxito",
      id: user.id,
      usuario: user.usuario,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.clave_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
    
    console.log(login, user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    res.status(200).json({ userId: user.id,  token, roles: user.roles, empresa: user.id_empresa, terminal: user.id_terminal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: err.message });
  }
};

const updatePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.clave_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const success = await updatePasswordInDatabase(user.id, hashedNewPassword);
    if (!success) {
      return res.status(400).json({message: "No hubo éxito al intentar actualizar la contraseña"});
    }

    res.status(200).json({ message: "Se actualizó la contraseña de manera exitosa" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al intentar actualizar contraseña", error: err.message });
  }
};

module.exports = {
  register,
  login,
  updatePassword,
};
