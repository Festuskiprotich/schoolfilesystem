const sequelize = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Attendance = require('./Attendance');
const Exam = require('./Exam');
const ExamResult = require('./ExamResult');
const Homework = require('./Homework');
const HomeworkSubmission = require('./HomeworkSubmission');
const Message = require('./Message');
const Notification = require('./Notification');
const Timetable = require('./Timetable');

// Associations
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(ExamResult, { foreignKey: 'studentId' });
ExamResult.belongsTo(Student, { foreignKey: 'studentId' });
ExamResult.belongsTo(Exam, { foreignKey: 'examId' });
Exam.hasMany(ExamResult, { foreignKey: 'examId' });

Homework.hasMany(HomeworkSubmission, { foreignKey: 'homeworkId' });
HomeworkSubmission.belongsTo(Homework, { foreignKey: 'homeworkId' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });

User.hasMany(Notification, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User, Student, Attendance, Exam, ExamResult,
  Homework, HomeworkSubmission, Message, Notification, Timetable,
};
