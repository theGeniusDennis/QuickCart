const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser, isAdmin } = require('../middlewares/auth');

// All order routes require authentication
router.use(authenticateUser);

// Create new order from cart
router.post('/', orderController.createOrder);

// Get user's orders
router.get('/', orderController.getOrders);

// Get order details
router.get('/:id', orderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status', isAdmin, orderController.updateOrderStatus);

// Cancel order
router.delete('/:id', orderController.cancelOrder);

module.exports = router; 