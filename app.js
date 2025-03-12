const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const invFisicoRoutes = require("./routes/invFisicoRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require('cors');


dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/inventario", authMiddleware, invFisicoRoutes);

const PORT = process.env.PORT || 51810;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
