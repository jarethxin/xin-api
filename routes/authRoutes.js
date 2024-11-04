const express = require('express');
const {register, login, updatePassword} = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update-password', updatePassword);

module.exports = router;