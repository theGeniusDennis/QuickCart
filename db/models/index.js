'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Validate environment
if (!['development', 'test', 'production'].includes(env)) {
  throw new Error(`Invalid NODE_ENV: ${env}. Must be one of: development, test, production`);
}

// Load and validate config
let config;
try {
  config = require(__dirname + '/../config/config.js')[env];
  if (!config) {
    throw new Error(`No configuration found for environment: ${env}`);
  }
} catch (error) {
  console.error('Error loading database configuration:', error);
  throw error;
}

const db = {};

// Initialize Sequelize with proper error handling
let sequelize;
try {
  if (config.use_env_variable) {
    const envVar = process.env[config.use_env_variable];
    if (!envVar) {
      throw new Error(`Environment variable ${config.use_env_variable} is not set`);
    }
    sequelize = new Sequelize(envVar, config);
  } else {
    if (!config.database || !config.username || !config.password) {
      throw new Error('Database configuration is incomplete. Check your config file.');
    }
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
} catch (error) {
  console.error('Error initializing Sequelize:', error);
  throw error;
}

// Load models with error handling
try {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      try {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        console.log(`✅ Model loaded: ${model.name}`);
      } catch (error) {
        console.error(`❌ Error loading model ${file}:`, error);
        throw error;
      }
    });
} catch (error) {
  console.error('Error loading models:', error);
  throw error;
}

// Set up model associations
try {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
      console.log(`✅ Associations set up for: ${modelName}`);
    }
  });
} catch (error) {
  console.error('Error setting up model associations:', error);
  throw error;
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
