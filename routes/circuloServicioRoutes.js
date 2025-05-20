const express = require('express');
const { get_viaje_activo_data_by_no_operador, get_ubicacion_destino_data_by_folio_viaje } = require("../controllers/circuloServicioController");
const router = express.Router();

router.get('/viaje-activo-data', get_viaje_activo_data_by_no_operador);

router.get('/ubicacion-destino-data', get_ubicacion_destino_data_by_folio_viaje);

module.exports = router;