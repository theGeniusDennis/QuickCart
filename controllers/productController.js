const { Product } = require('../db/models');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        where: { isActive: true }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching products',
        details: error.message
      });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching product',
        details: error.message
      });
    }
  },

  // Create new product (admin only)
  createProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        stock,
        imageUrl,
        category
      } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        imageUrl,
        category
      });

      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error creating product',
        details: error.message
      });
    }
  },

  // Update product (admin only)
  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      const {
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
        isActive
      } = req.body;

      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
        imageUrl: imageUrl || product.imageUrl,
        category: category || product.category,
        isActive: isActive !== undefined ? isActive : product.isActive
      });

      res.json({
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error updating product',
        details: error.message
      });
    }
  },

  // Delete product (admin only)
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      // Soft delete by setting isActive to false
      await product.update({ isActive: false });

      res.json({
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error deleting product',
        details: error.message
      });
    }
  },

  // Search products
  searchProducts: async (req, res) => {
    try {
      const { query, category } = req.query;
      const where = { isActive: true };

      if (query) {
        where.name = {
          [Op.iLike]: `%${query}%`
        };
      }

      if (category) {
        where.category = category;
      }

      const products = await Product.findAll({ where });
      res.json(products);
    } catch (error) {
      res.status(500).json({
        error: 'Error searching products',
        details: error.message
      });
    }
  }
};

module.exports = productController; 