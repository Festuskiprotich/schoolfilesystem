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
const { Homework, HomeworkSubmission, Student } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// POST /api/homework
router.post('/', authenticate, authorize('admin', 'teacher'), [
  body('title').trim().notEmpty(),
  body('subject').notEmpty(),
  body('grade').notEmpty(),
  body('dueDate').isDate(),
], validate, async (req, res) => {
  try {
    const hw = await Homework.create({ ...req.body, teacherId: req.user.id });
    res.status(201).json(hw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/homework
router.get('/', authenticate, async (req, res) => {
  try {
    const { grade } = req.query;
    const where = grade ? { grade } : {};
    const list = await Homework.findAll({ where, order: [['dueDate', 'ASC']] });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/homework/:id
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const hw = await Homework.findByPk(req.params.id);
    if (!hw) return res.status(404).json({ message: 'Homework not found' });
    await hw.update(req.body);
    res.json(hw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/homework/:id
router.delete('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    await Homework.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Homework deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/homework/:id/submit  (student)
router.post('/:id/submit', authenticate, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const hw = await Homework.findByPk(req.params.id);
    if (!hw) return res.status(404).json({ message: 'Homework not found' });

    const isLate = new Date() > new Date(hw.dueDate);
    const [sub, created] = await HomeworkSubmission.findOrCreate({
      where: { homeworkId: req.params.id, studentId: student.id },
      defaults: { notes: req.body.notes, fileUrl: req.body.fileUrl, status: isLate ? 'late' : 'submitted' },
    });
    if (!created) await sub.update({ notes: req.body.notes, fileUrl: req.body.fileUrl });
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/homework/:id/submissions  (teacher/admin)
router.get('/:id/submissions', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const subs = await HomeworkSubmission.findAll({ where: { homeworkId: req.params.id } });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/homework/submissions/:subId/grade  (teacher/admin)
router.put('/submissions/:subId/grade', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const sub = await HomeworkSubmission.findByPk(req.params.subId);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });
    await sub.update({ marks: req.body.marks, status: 'graded' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
