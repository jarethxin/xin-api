const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const invFisicoRoutes = require("./routes/invFisicoRoutes");
const liquidacionesRoutes = require("./routes/liquidacionesRoutes");
const circuloServicioRoutes = require("./routes/circuloServicioRoutes");
const logRoutes = require("./routes/logRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require('cors');

const { mssqlPool } = require('./config/mssql');
const { pgPool }    = require('./config/postgresql');

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/inventario", authMiddleware, invFisicoRoutes);

app.use("/api/v1/liquidaciones", authMiddleware, liquidacionesRoutes);

app.use("/api/v1/circulo-servicio", authMiddleware, circuloServicioRoutes);

app.use("/api/v1/log", authMiddleware, logRoutes);

const PORT = process.env.PORT || 51810;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', shutDown);
process.on('SIGINT',  shutDown);

async function shutDown() {
  console.log('\nShutting down…');
  try {
    await (await mssqlPool).close(); // SQL Server
    await pgPool.end();              // PostgreSQL
    console.log('DB pools closed. Bye!');
    process.exit(0);
  } catch (err) {
    console.error('Error closing pools:', err);
    process.exit(1);
  }
}