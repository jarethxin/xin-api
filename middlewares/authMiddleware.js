const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Autenticación requerida" });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token no válido" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error en authMiddleware:", error.message);
    res.status(500).json({ message: "Error de autenticación", error: error.message });
  }
};

module.exports = authMiddleware;