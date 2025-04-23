const express = require('express');
const {get_liquidaciones_by_no_operador} = require('../controllers/liquidacionesController');
const router = express.Router();

router.get('/operador', get_liquidaciones_by_no_operador);

module.exports = router;