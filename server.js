require('dotenv').config(); // Load environment variables early
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { sequelize } = require('./db/models/index')

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 5050;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
    console.log('Database name:', sequelize.config.database);
    console.log('Database host:', sequelize.config.host);
    console.log('Database port:', sequelize.config.port);

    // Only start the server if database connection is successful
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      sqlState: err.sqlState
    });
    process.exit(1); // Exit the process if database connkkkection fails
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});
