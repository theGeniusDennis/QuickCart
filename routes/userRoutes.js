const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateUser, userController.getProfile);
router.put('/profile', authenticateUser, userController.updateProfile);

module.exports = router; 