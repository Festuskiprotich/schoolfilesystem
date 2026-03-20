const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Timetable = sequelize.define('Timetable', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  grade: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING },
  dayOfWeek: { type: DataTypes.ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  teacherId: { type: DataTypes.INTEGER },
  startTime: { type: DataTypes.STRING, allowNull: false },
  endTime: { type: DataTypes.STRING, allowNull: false },
  room: { type: DataTypes.STRING },
});

module.exports = Timetable;
