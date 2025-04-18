const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../middlewares/auth');

// All cart routes require authentication
router.use(authenticateUser);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.put('/:cartItemId', cartController.updateCartItem);

// Remove item from cart
router.delete('/:cartItemId', cartController.removeFromCart);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router; 