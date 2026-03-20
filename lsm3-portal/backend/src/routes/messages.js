const router = require('express').Router();
const { Op } = require('sequelize');
const { Message, User } = require('../models');
const { authenticate } = require('../middleware/auth');

// POST /api/messages
router.post('/', authenticate, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content) return res.status(400).json({ message: 'receiverId and content required' });

    const msg = await Message.create({ senderId: req.user.id, receiverId, content });

    // Emit via socket if available
    const io = req.app.get('io');
    if (io) io.to(`user_${receiverId}`).emit('new_message', msg);

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/conversation/:userId
router.get('/conversation/:userId', authenticate, async (req, res) => {
  try {
    const otherId = parseInt(req.params.userId);
    const myId = req.user.id;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: otherId },
          { senderId: otherId, receiverId: myId },
        ],
      },
      order: [['sentAt', 'ASC']],
    });
    // Mark as read
    await Message.update({ isRead: true }, { where: { senderId: otherId, receiverId: myId, isRead: false } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/inbox
router.get('/inbox', authenticate, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { receiverId: req.user.id },
      order: [['sentAt', 'DESC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/unread-count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Message.count({ where: { receiverId: req.user.id, isRead: false } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
