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
const { Student, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/students/me  (student gets own profile) â€” must be before /:id
router.get('/me', authenticate, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });
    if (!student) return res.status(404).json({ message: 'Profile not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students  (admin, teacher, parent)
router.get('/', authenticate, authorize('admin', 'teacher', 'parent'), async (req, res) => {
  try {
    const { grade } = req.query;
    const where = grade ? { grade } : {};
    const students = await Student.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students  (admin creates student profile)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students/:id  â€” must be after /me
router.get('/:id', authenticate, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
