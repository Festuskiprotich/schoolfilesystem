/*
 *  _____         _                  _  __  __  _
 * |  ___|__  ___| |_ _   _ ___ __ _(_)/ _|| |_| |_ _ __ _____  __
 * | |_ / _ \/ __| __| | | / __/ _` | | |_ | __| __| '__/ _ \ \/ /
 * |  _|  __/\__ \ |_| |_| \__ \ (_| | |  _|| |_| |_| | | (_) >  <
 * |_|  \___||___/\__|\__,_|___/\__,_|_|_|   \__|\__|_|  \___/_/\_\
 *
 *  LSM3 - Advanced School Portal
 *  Techswifttrix Agency
 */

const router = require('express').Router();
const { body } = require('express-validator');
const { Op } = require('sequelize');
const { Attendance, Student, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// POST /api/attendance  (teacher/admin)
router.post('/', authenticate, authorize('teacher', 'admin'), [
  body('studentId').isInt(),
  body('date').isDate(),
  body('status').isIn(['present', 'absent', 'late']),
], validate, async (req, res) => {
  try {
    const { studentId, date, status, subject, remarks } = req.body;
    const [record, created] = await Attendance.findOrCreate({
      where: { studentId, date, subject: subject || null },
      defaults: { teacherId: req.user.id, status, remarks },
    });
    if (!created) await record.update({ status, remarks, teacherId: req.user.id });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/attendance/bulk  (teacher/admin)
router.post('/bulk', authenticate, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { records } = req.body; // [{ studentId, date, status, subject }]
    const results = await Promise.all(records.map(async (r) => {
      const [record, created] = await Attendance.findOrCreate({
        where: { studentId: r.studentId, date: r.date, subject: r.subject || null },
        defaults: { teacherId: req.user.id, status: r.status },
      });
      if (!created) await record.update({ status: r.status, teacherId: req.user.id });
      return record;
    }));
    res.status(201).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance?studentId=&date=&month=  
router.get('/', authenticate, async (req, res) => {
  try {
    const { studentId, date, month, year } = req.query;
    const where = {};

    if (studentId) where.studentId = studentId;
    if (date) where.date = date;
    if (month && year) {
      where.date = {
        [Op.between]: [
          `${year}-${String(month).padStart(2, '0')}-01`,
          `${year}-${String(month).padStart(2, '0')}-31`,
        ],
      };
    }

    // Students can only see their own
    if (req.user.role === 'student') {
      const student = await Student.findOne({ where: { userId: req.user.id } });
      if (student) where.studentId = student.id;
    }

    const records = await Attendance.findAll({ where, order: [['date', 'DESC']] });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance/summary/:studentId
router.get('/summary/:studentId', authenticate, async (req, res) => {
  try {
    const records = await Attendance.findAll({ where: { studentId: req.params.studentId } });
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const percentage = total ? ((present / total) * 100).toFixed(1) : 0;
    res.json({ total, present, absent, late, percentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
