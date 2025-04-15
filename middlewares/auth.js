const jwt = require('jsonwebtoken');
const { User } = require('../db/models');

const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required'
    });
  }
  next();
};

module.exports = {
  authenticateUser,
  isAdmin
}; 