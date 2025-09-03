// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing
const crypto = require('crypto'); // For password reset functionality

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Do not return password in queries by default
  },
  preferences: {
    defaultCategory: {
      type: String,
      enum: ['college', 'business', 'ngo'],
      default: 'college' // Default, but will be set via onboarding
    },
    // REMOVED: defaultAudience
    notificationEmails: {
      type: Boolean,
      default: true
    },
    autoGeneratePosts: { // New field: Enable/disable full automation
      type: Boolean,
      default: true
    },
    categoryDetails: {
      educational: { // For 'college' or 'ngo' with educational focus
        collegeName: { type: String, default: null },
        schoolName: { type: String, default: null },
      },
      business: { // For 'business' category
        industry: { type: String, default: null },
        companyName: { type: String, default: null },
      },
      ngo: { // For 'ngo' category
        cause: { type: String, default: null },
      }
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
