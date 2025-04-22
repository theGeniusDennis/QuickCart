'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      
      // Define associations here
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
    }

    // Instance method to calculate total
    async calculateTotal() {
      const items = await this.getCartItems({
        include: [{ model: sequelize.models.Product }]
      });
      
      return items.reduce((total, item) => {
        return total + (item.quantity * item.Product.price);
      }, 0);
    }
  }

  Cart.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Cart'
  });

  return Cart;
}; 