const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  parentId: { type: DataTypes.INTEGER }, // references User (parent role)
  grade: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING },
  rollNumber: { type: DataTypes.STRING },
});

module.exports = Student;
