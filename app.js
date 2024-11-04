const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require('cors');


dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

// ejemplo de ruta protegida
app.get("api/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Acceso a ruta protegida concedido" });
});

const PORT = process.env.PORT || 51810;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
