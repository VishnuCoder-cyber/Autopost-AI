// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  occasion: {
    type: String,
    required: [true, 'Occasion is required'],
    trim: true,
    maxlength: [100, 'Occasion cannot exceed 100 characters'],
    // REMOVED: enum validator
    // enum: [
    //   'Daily Motivation', 'Product Launch', 'Event Promotion', 'Behind the Scenes',
    //   'Customer Spotlight', 'Holiday Greeting', 'Educational Tip', 'Q&A Session',
    //   'Team Introduction', 'Success Story', 'Call for Volunteers', 'Fundraising Appeal',
    //   'Announcement', 'Milestone', 'Giveaway', 'Contest', 'Tutorial', 'Live Session',
    //   'Testimonial', 'Community Highlight', 'Product Update', 'Service Spotlight',
    //   'Event Recap', 'Throwback'
    // ],
    // message: 'Occasion must be one of the predefined use cases.'
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    maxlength: [2200, 'Caption cannot exceed 2200 characters'] // Instagram limit
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  imagePrompt: {
    type: String,
    trim: true,
    maxlength: [500, 'Image prompt cannot exceed 500 characters'],
    default: ''
  },
  audience: {
    type: String,
    enum: ['general', 'students', 'professionals', 'donors', 'community', 'alumni'],
    default: 'general'
  },
  category: {
    type: String,
    enum: ['college', 'business', 'ngo'],
    required: [true, 'Category is required']
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posting', 'posted', 'failed'],
    default: 'draft'
  },
  scheduledTime: {
    type: Date,
    // Required only if status is 'scheduled'
    required: function() { return this.status === 'scheduled'; }
  },
  postedTime: {
    type: Date
  },
  errors: [{
    message: String,
    timestamp: { type: Date, default: Date.now },
    retryCount: { type: Number, default: 0 }
  }],
  engagement: { // Simulated engagement metrics
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  metadata: { // Store AI model info, generation time etc.
    aiModel: { type: String, default: 'N/A' },
    imageModel: { type: String, default: 'N/A' },
    generationTime: { type: Number, default: 0 }, // in milliseconds
    captionUsage: { // Token usage from AI for caption
      promptTokens: { type: Number, default: 0 },
      candidatesTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 }
    },
    revisedPrompt: { type: String, default: '' }, // If AI revised the image prompt
    generatedAt: { type: Date, default: Date.now }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a unique compound index to prevent duplicate posts for the same user, occasion, category, and scheduled day
// This will prevent the cron job from creating multiple posts for the same event on the same day.
postSchema.index({ userId: 1, occasion: 1, category: 1, scheduledTime: 1 }, { unique: true });


const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

module.exports = Post;
