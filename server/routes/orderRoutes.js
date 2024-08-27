const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders (admin only)
router.get('/', orderController.getAllOrders);

// Get a specific order by ID (admin only)
router.get('/:id', orderController.getOrderById);

// Update an order status (admin only)
router.put('/:id', orderController.updateOrderStatus);

// Delete an order (admin only)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
