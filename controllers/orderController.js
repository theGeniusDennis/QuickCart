const { Order, OrderItem, Cart, CartItem, Product } = require('../db/models');

const orderController = {
  // Create order from cart
  createOrder: async (req, res) => {
    try {
      const { shippingAddress, paymentMethod } = req.body;

      // Get user's cart
      const cart = await Cart.findOne({
        where: { userId: req.user.id },
        include: [{
          model: CartItem,
          include: [Product]
        }]
      });

      if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
        return res.status(400).json({
          error: 'Cart is empty'
        });
      }

      // Calculate total
      const total = cart.CartItems.reduce((sum, item) => {
        return sum + (item.quantity * item.Product.price);
      }, 0);

      // Create order
      const order = await Order.create({
        userId: req.user.id,
        total,
        shippingAddress,
        paymentMethod,
        status: 'pending',
        paymentStatus: 'pending'
      });

      // Create order items
      const orderItems = await Promise.all(
        cart.CartItems.map(async (cartItem) => {
          return OrderItem.create({
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.Product.price
          });
        })
      );

      // Clear cart
      await CartItem.destroy({
        where: { cartId: cart.id }
      });

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          ...order.toJSON(),
          items: orderItems
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error creating order',
        details: error.message
      });
    }
  },

  // Get user's orders
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{
          model: OrderItem,
          include: [Product]
        }],
        order: [['createdAt', 'DESC']]
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching orders',
        details: error.message
      });
    }
  },

  // Get order details
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        include: [{
          model: OrderItem,
          include: [Product]
        }]
      });

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching order',
        details: error.message
      });
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      // Validate status
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status'
        });
      }

      await order.update({ status });

      res.json({
        message: 'Order status updated successfully',
        order
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error updating order status',
        details: error.message
      });
    }
  },

  // Cancel order
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      // Only allow cancellation of pending orders
      if (order.status !== 'pending') {
        return res.status(400).json({
          error: 'Only pending orders can be cancelled'
        });
      }

      await order.update({ status: 'cancelled' });

      res.json({
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error cancelling order',
        details: error.message
      });
    }
  }
};

module.exports = orderController; 