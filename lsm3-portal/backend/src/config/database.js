const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite — no installation needed, stores data in a local file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'),
  logging: false,
});

module.exports = sequelize;
