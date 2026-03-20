require('dotenv').config({
  path: require('path').resolve(
    __dirname, '..', process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
  ),
});

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
const { sequelize } = require('./models');
const initSocket = require('./socket');

const isProd = process.env.NODE_ENV === 'production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'], credentials: true },
});

// ── Security & performance middleware ──────────────────────────
app.use(helmet());
app.use(compression());
app.set('trust proxy', 1);

// CORS
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Rate limiting — global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
}));

// Stricter rate limit on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again later.' },
});

app.use(express.json({ limit: '10kb' })); // prevent large payload attacks
app.use(isProd ? morgan('combined') : morgan('dev'));

// Make io accessible in routes
app.set('io', io);

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/homework', require('./routes/homework'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/timetable', require('./routes/timetable'));

// Health check (used by load balancers / uptime monitors)
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date() })
);

// Serve React build in production
if (isProd) {
  const buildPath = path.join(__dirname, '..', '..', 'frontend', 'build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    message: isProd ? 'Internal server error' : err.message,
  });
});

// ── Socket.io ─────────────────────────────────────────────────
initSocket(io);

// ── Graceful shutdown ─────────────────────────────────────────
const shutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    await sequelize.close();
    logger.info('Server and DB connections closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000); // force exit after 10s
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Unhandled errors ──────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  if (isProd) process.exit(1);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
sequelize
  .sync({ alter: !isProd }) // in production, never auto-alter — use migrations
  .then(() => {
    logger.info(`Database connected [${isProd ? 'production' : 'development'}]`);
    server.listen(PORT, () => logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`));
  })
  .catch((err) => {
    logger.error('DB connection failed:', err);
    process.exit(1);
  });
