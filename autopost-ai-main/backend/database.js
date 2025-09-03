// backend/database.js
const mongoose = require('mongoose');
const winston = require('winston'); // For logging

// Configure Winston logger for database events
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // You might add file transports for production:
    // new winston.transports.File({ filename: 'db_error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'db_combined.log' })
  ],
});

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 */
const connectDB = async () => {
  try {
    // MongoDB connection options (modern Mongoose versions handle most defaults)
    // Removed deprecated options like useNewUrlParser, useUnifiedTopology, bufferMaxEntries
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // bufferCommands: false, // This is often not needed with modern drivers
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info(`
🍃 MongoDB Connected Successfully!
📍 Host: ${conn.connection.host}
📊 Database: ${conn.connection.name}
🔌 Port: ${conn.connection.port}
    `);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.warn('🔚 Mongoose connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Database utility functions
const dbUtils = {
  // Check if database is connected
  isConnected: () => {
    return mongoose.connection.readyState === 1;
  },

  // Get connection status
  getConnectionState: () => {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState];
  },

  // Close database connection
  closeConnection: async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info('🔚 Database connection closed manually');
    }
  },

  // Get database statistics
  getStats: async () => {
    if (!dbUtils.isConnected()) {
      throw new Error('Database not connected');
    }

    const db = mongoose.connection.db;
    const stats = await db.stats();

    return {
      database: mongoose.connection.name,
      collections: stats.collections,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
      totalSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
    };
  }
};

module.exports = connectDB;
module.exports.dbUtils = dbUtils;
