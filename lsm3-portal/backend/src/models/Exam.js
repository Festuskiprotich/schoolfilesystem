const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  grade: { type: DataTypes.STRING, allowNull: false },
  totalMarks: { type: DataTypes.INTEGER, allowNull: false },
  examDate: { type: DataTypes.DATEONLY, allowNull: false },
  createdBy: { type: DataTypes.INTEGER, allowNull: false }, // teacher/admin userId
});

module.exports = Exam;
