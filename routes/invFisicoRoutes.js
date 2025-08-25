const express = require('express');
const {get_andenes, create_inventory, create_inventory_detail, create_truck_inventory_detail} = require('../controllers/invFisicoController');
const router = express.Router();

router.get('/andenes', get_andenes);
router.post('/create-inventory', create_inventory);
router.post('/create-inventory-detail', create_inventory_detail);
router.post('/create-truck-inventory-detail', create_truck_inventory_detail);

module.exports = router;