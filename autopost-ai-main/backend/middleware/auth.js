// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

/**
 * @description Middleware to protect routes, ensuring only authenticated users can access them.
 * It expects a JWT in the 'Authorization' header in the format 'Bearer TOKEN'.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      // process.env.JWT_SECRET is crucial here, ensure it's set in your .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (excluding password for security)
      // We find the user by ID from the token payload
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // If user associated with token doesn't exist (e.g., user deleted)
        console.error('Auth middleware: User not found for decoded token ID:', decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Authentication error (JWT verification failed):', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
      }
      // General authentication error
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else { // If no token is provided or header is malformed
    console.warn('Auth middleware: No Bearer token found in Authorization header.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
