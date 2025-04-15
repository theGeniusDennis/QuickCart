'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 999.99,
        stock: 50,
        imageUrl: 'https://example.com/smartphone.jpg',
        category: 'Electronics',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones',
        price: 299.99,
        stock: 30,
        imageUrl: 'https://example.com/headphones.jpg',
        category: 'Electronics',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1499.99,
        stock: 20,
        imageUrl: 'https://example.com/laptop.jpg',
        category: 'Electronics',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000005',
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 199.99,
        stock: 40,
        imageUrl: 'https://example.com/smartwatch.jpg',
        category: 'Electronics',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', {
      id: [
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000005'
      ]
    }, {});
  }
}; 