// backend/routes/auth.js
const express = require('express');
const Joi = require('joi'); // For input validation
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For creating JWTs
const User = require('../models/User'); // User model
const auth = require('../middleware/auth'); // Authentication middleware
// REMOVED: axios import as Instagram integration is removed

const router = express.Router();

// Joi schema for user registration
const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Joi schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Joi schema for updating user preferences and category details
const updatePreferencesSchema = Joi.object({
  defaultCategory: Joi.string().valid('college', 'business', 'ngo').required(),
  autoGeneratePosts: Joi.boolean().required(),
  categoryDetails: Joi.object({
    educational: Joi.object({
      collegeName: Joi.string().allow(null, ''),
      schoolName: Joi.string().allow(null, '')
    }).optional(),
    business: Joi.object({
      industry: Joi.string().allow(null, ''),
      companyName: Joi.string().allow(null, '')
    }).optional(),
    ngo: Joi.object({
      cause: Joi.string().allow(null, '')
    }).optional()
  }).optional()
});


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = value;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // Create new user (password hashing handled by pre-save hook in User model)
    user = new User({
      username,
      email,
      password,
      // Default preferences are set by the schema
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '100y' // Token expires in 100 years // <--- CHANGED HERE
    });

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
        // REMOVED: Instagram-related fields from response
      }
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

/**
 * @route POST /api/auth/login
 * @description Authenticate user & get token
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // Check for user by email (select password explicitly as it's set to select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '100y' // Token expires in 100 years // <--- CHANGED HERE
    });

    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
        // REMOVED: Instagram-related fields from response
      }
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

/**
 * @route GET /api/auth/me
 * @description Get authenticated user's profile
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is populated by the auth middleware
    const user = await User.findById(req.user.id).select('-password'); // Ensure password is not sent
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
});

/**
 * @route PUT /api/auth/update-preferences
 * @description Update authenticated user's preferences and category details
 * @access Private
 */
router.put('/update-preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { error, value } = updatePreferencesSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update preferences directly
    user.preferences.defaultCategory = value.defaultCategory;
    user.preferences.autoGeneratePosts = value.autoGeneratePosts;

    if (value.categoryDetails) {
      user.preferences.categoryDetails = {};
      if (value.categoryDetails.educational) {
        user.preferences.categoryDetails.educational = value.categoryDetails.educational;
      }
      if (value.categoryDetails.business) {
        user.preferences.categoryDetails.business = value.categoryDetails.business;
      }
      if (value.categoryDetails.ngo) {
        user.preferences.categoryDetails.ngo = value.categoryDetails.ngo;
      }
    } else {
        user.preferences.categoryDetails = {};
    }

    await user.save();

    res.status(200).json({
      message: 'User preferences updated successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
      }
    });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Server error updating preferences', error: error.message });
  }
});

// REMOVED ALL INSTAGRAM-RELATED ROUTES:
// router.get('/instagram/connect', ...);
// router.get('/instagram/callback', ...);
// router.get('/instagram/info', ...);


module.exports = router;
