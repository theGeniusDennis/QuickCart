const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, isAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticateUser, isAdmin, productController.createProduct);
router.put('/:id', authenticateUser, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateUser, isAdmin, productController.deleteProduct);

module.exports = router; 