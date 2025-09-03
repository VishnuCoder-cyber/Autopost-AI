// backend/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston'); // For logging
const cron = require('node-cron'); // For scheduling tasks

// Import routes
const generateRoutes = require('./routes/generate');
const schedulerRoutes = require('./routes/scheduler');
const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed'); // For the simulated feed

// Import services/utilities
const connectDB = require('./database');
const { dbUtils } = require('./database'); // For DB health check

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'AutoPost AI Backend is operational!', healthCheck: '/api/health' });
});

app.get('/api/health', async (req, res) => {
  const uptime = process.uptime();
  let dbStatus = 'disconnected';
  let dbStats = null;
  let dbError = null;

  try {
    dbStatus = dbUtils.getConnectionState();
    if (dbUtils.isConnected()) {
      dbStats = await dbUtils.getStats();
    }
  } catch (error) {
    dbError = error.message;
    logger.error('Error fetching DB stats for health check:', error.message);
  }

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: {
      status: dbStatus,
      stats: dbStats,
      error: dbError
    }
  });
});

app.use('/api/generate', generateRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred.',
      status: err.status || 500,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});



// --- Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info('🚀 AutoPost AI Backend Server Started!');
  logger.info(`📍 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🕐 Started at: ${new Date().toISOString()}`);
  logger.info(`📊 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
