const { User } = require('../db/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;

const userController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'User with this email or username already exists'
        });
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error registering user',
        details: error.message
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error logging in',
        details: error.message
      });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching profile',
        details: error.message
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { username, email } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      // Update user
      await user.update({
        username: username || user.username,
        email: email || user.email
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error updating profile',
        details: error.message
      });
    }
  }
};

module.exports = userController; 