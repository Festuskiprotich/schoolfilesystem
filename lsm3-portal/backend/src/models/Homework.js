const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Homework = sequelize.define('Homework', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  subject: { type: DataTypes.STRING, allowNull: false },
  grade: { type: DataTypes.STRING, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  teacherId: { type: DataTypes.INTEGER, allowNull: false },
  fileUrl: { type: DataTypes.STRING },
});

module.exports = Homework;
