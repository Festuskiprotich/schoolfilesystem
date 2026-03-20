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
const { Notification } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/notifications  (admin/teacher broadcast)
router.post('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { userIds, title, message, type } = req.body;
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'userIds array required' });
    }

    const notifications = await Notification.bulkCreate(
      userIds.map(uid => ({
        userId: uid,
        title,
        message,
        type: type || 'info',
        createdBy: req.user.id,
      }))
    );

    const io = req.app.get('io');
    if (io) {
      userIds.forEach(uid =>
        io.to(`user_${uid}`).emit('notification', { title, message, type })
      );
    }

    res.status(201).json({ created: notifications.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/notifications  (own)
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/read-all  â€” MUST be before /:id/read to avoid route conflict
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id } });
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { id: req.params.id, userId: req.user.id } }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
