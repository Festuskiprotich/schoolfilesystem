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

const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

module.exports = (io) => {
  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: user ${socket.userId}`);

    // Join personal room
    socket.join(`user_${socket.userId}`);

    socket.on('send_message', (data) => {
      // data: { receiverId, content }
      io.to(`user_${data.receiverId}`).emit('new_message', {
        senderId: socket.userId,
        content: data.content,
        sentAt: new Date(),
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: user ${socket.userId}`);
    });
  });
};
