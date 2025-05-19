const express = require('express');
const {create_log} = require('../controllers/logController');
const router = express.Router();

router.get('/create', create_log);

module.exports = router;