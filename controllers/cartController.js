const { Cart, Product } = require('../db/models');

const cartController = {
  // Get user's cart
  getCart: async (req, res) => {
    try {
      const cartItems = await Cart.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'imageUrl']
        }]
      });

      const total = cartItems.reduce((sum, item) => sum + item.total, 0);

      res.json({
        items: cartItems,
        total
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching cart',
        details: error.message
      });
    }
  },

  // Add item to cart
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      // Get product details
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      // Check if product is already in cart
      let cartItem = await Cart.findOne({
        where: {
          userId: req.user.id,
          productId
        }
      });

      if (cartItem) {
        // Update quantity if item exists
        const newQuantity = cartItem.quantity + quantity;
        const newTotal = newQuantity * product.price;

        await cartItem.update({
          quantity: newQuantity,
          total: newTotal
        });
      } else {
        // Create new cart item
        const total = quantity * product.price;
        cartItem = await Cart.create({
          userId: req.user.id,
          productId,
          quantity,
          price: product.price,
          total
        });
      }

      res.status(201).json({
        message: 'Item added to cart successfully',
        cartItem
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error adding item to cart',
        details: error.message
      });
    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      const cartItem = await Cart.findOne({
        where: {
          id: cartItemId,
          userId: req.user.id
        },
        include: [Product]
      });

      if (!cartItem) {
        return res.status(404).json({
          error: 'Cart item not found'
        });
      }

      const newTotal = quantity * cartItem.Product.price;

      await cartItem.update({
        quantity,
        total: newTotal
      });

      res.json({
        message: 'Cart item updated successfully',
        cartItem
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error updating cart item',
        details: error.message
      });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    try {
      const { cartItemId } = req.params;

      const cartItem = await Cart.findOne({
        where: {
          id: cartItemId,
          userId: req.user.id
        }
      });

      if (!cartItem) {
        return res.status(404).json({
          error: 'Cart item not found'
        });
      }

      await cartItem.destroy();

      res.json({
        message: 'Item removed from cart successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error removing item from cart',
        details: error.message
      });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      await Cart.destroy({
        where: { userId: req.user.id }
      });

      res.json({
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error clearing cart',
        details: error.message
      });
    }
  }
};

module.exports = cartController; 