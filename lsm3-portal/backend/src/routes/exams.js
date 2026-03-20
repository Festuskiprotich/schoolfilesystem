const router = require('express').Router();
const { body } = require('express-validator');
const { Exam, ExamResult, Student, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// POST /api/exams
router.post('/', authenticate, authorize('admin', 'teacher'), [
  body('title').trim().notEmpty(),
  body('subject').notEmpty(),
  body('grade').notEmpty(),
  body('totalMarks').isInt({ min: 1 }),
  body('examDate').isDate(),
], validate, async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/exams
router.get('/', authenticate, async (req, res) => {
  try {
    const { grade } = req.query;
    const where = grade ? { grade } : {};
    const exams = await Exam.findAll({ where, order: [['examDate', 'DESC']] });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/exams/results/student/:studentId  — MUST be before /:id to avoid route conflict
router.get('/results/student/:studentId', authenticate, async (req, res) => {
  try {
    const results = await ExamResult.findAll({
      where: { studentId: req.params.studentId },
      include: [{ model: Exam }],
      order: [[Exam, 'examDate', 'DESC']],
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/exams/:id
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    await exam.update(req.body);
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/exams/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await Exam.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/exams/:id/results  (enter marks)
router.post('/:id/results', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { results } = req.body; // [{ studentId, marksObtained, remarks }]
    const saved = await Promise.all(
      results.map(async (r) => {
        const [record, created] = await ExamResult.findOrCreate({
          where: { examId: req.params.id, studentId: r.studentId },
          defaults: { marksObtained: r.marksObtained, remarks: r.remarks },
        });
        if (!created) {
          await record.update({ marksObtained: r.marksObtained, remarks: r.remarks });
        }
        return record;
      })
    );
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/exams/:id/results
router.get('/:id/results', authenticate, async (req, res) => {
  try {
    const results = await ExamResult.findAll({
      where: { examId: req.params.id },
      include: [
        {
          model: Student,
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        },
      ],
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
