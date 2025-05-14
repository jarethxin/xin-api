const express = require('express');
const {get_liquidaciones_by_no_operador, get_liquidacion_pdf_by_operador_and_liquidacion} = require('../controllers/liquidacionesController');
const router = express.Router();

router.get('/operador', get_liquidaciones_by_no_operador);

router.get('/:noOperador/pdf/:folioLiquidacion', get_liquidacion_pdf_by_operador_and_liquidacion);

module.exports = router;