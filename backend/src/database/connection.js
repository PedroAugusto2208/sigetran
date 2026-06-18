const { Sequelize } = require('sequelize');
const path = require('path');

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTest
    ? ':memory:'
    : (process.env.DB_STORAGE || path.join(__dirname, '../../sigetran.db')),
  logging: false,
});

module.exports = sequelize;
