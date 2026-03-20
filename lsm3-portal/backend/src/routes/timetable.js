const router = require('express').Router();
const { Timetable } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/timetable
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const entry = await Timetable.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/timetable?grade=&section=
router.get('/', authenticate, async (req, res) => {
  try {
    const { grade, section } = req.query;
    const where = {};
    if (grade) where.grade = grade;
    if (section) where.section = section;
    const entries = await Timetable.findAll({ where, order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']] });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/timetable/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const entry = await Timetable.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    await entry.update(req.body);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/timetable/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await Timetable.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
