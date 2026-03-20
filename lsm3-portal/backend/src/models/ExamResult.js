const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamResult = sequelize.define('ExamResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  examId: { type: DataTypes.INTEGER, allowNull: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  marksObtained: { type: DataTypes.FLOAT, allowNull: false },
  grade: { type: DataTypes.STRING }, // auto-calculated
  percentage: { type: DataTypes.FLOAT }, // auto-calculated
  remarks: { type: DataTypes.STRING },
}, {
  hooks: {
    beforeSave: async (result) => {
      const Exam = require('./Exam');
      const exam = await Exam.findByPk(result.examId);
      if (exam) {
        result.percentage = parseFloat(((result.marksObtained / exam.totalMarks) * 100).toFixed(2));
        if (result.percentage >= 90) result.grade = 'A+';
        else if (result.percentage >= 80) result.grade = 'A';
        else if (result.percentage >= 70) result.grade = 'B';
        else if (result.percentage >= 60) result.grade = 'C';
        else if (result.percentage >= 50) result.grade = 'D';
        else result.grade = 'F';
      }
    },
  },
});

module.exports = ExamResult;
