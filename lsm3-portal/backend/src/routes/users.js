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
const { User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const logger = require('../config/logger');

// GET /api/users  â€” admin gets all, others get only active users (for messaging contact lists)
router.get('/', authenticate, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const where = isAdmin ? {} : { isActive: true };
    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id  (admin or self)
router.put('/:id', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('phone').optional(),
], validate, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user.id === parseInt(req.params.id);
    if (!isAdmin && !isSelf) return res.status(403).json({ message: 'Forbidden' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, isActive } = req.body;
    await user.update({ name, phone, ...(isAdmin && isActive !== undefined && { isActive }) });
    logger.info(`User ${req.params.id} updated by ${req.user.id}`);
    res.json({ message: 'User updated', user: { id: user.id, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id  (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update({ isActive: false });
    logger.info(`User ${req.params.id} deactivated by ${req.user.id}`);
    res.json({ message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
