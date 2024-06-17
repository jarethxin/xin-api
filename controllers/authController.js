const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  createUser,
  findUserById,
  findUserByUsername,
} = require("../models/userModel");

const register = async (req, res) => {
  const { username, password, employeeNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword, employeeNumber);
    res.status(201).json({
      message: "Usuario registrado con éxito",
      id: user.id,
      usuario: user.usuario,
    });
  } catch (err) {
    req
      .status(500)
      .json({ message: "Error al registrar usuario", error: err.message });
  }
};

const login = async (res, req) => {
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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    res.status(200).json({ token });
  } catch (err) {
    req
      .status(500)
      .json({ message: "Error al iniciar sesión", error: err.message });
  }
};

module.exports = {
  register,
  login,
};
