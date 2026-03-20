const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeworkSubmission = sequelize.define('HomeworkSubmission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  homeworkId: { type: DataTypes.INTEGER, allowNull: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fileUrl: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('submitted', 'graded', 'late'), defaultValue: 'submitted' },
  marks: { type: DataTypes.FLOAT },
});

module.exports = HomeworkSubmission;
