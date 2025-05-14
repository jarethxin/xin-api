const express = require('express');
const { get_viaje_activo_data_by_no_operador } = require("../controllers/circuloServicioController");
const router = express.Router();

router.get('/viaje-activo-data', get_viaje_activo_data_by_no_operador);

module.exports = router;