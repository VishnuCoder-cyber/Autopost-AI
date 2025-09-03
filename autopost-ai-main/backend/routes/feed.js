// backend/routes/feed.js
const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth'); // Assuming you want to show posts only to logged-in users

const router = express.Router();

/**
 * @route GET /api/feed/posts
 * @description Get all posts that have been 'posted' (simulated)
 * @access Private (requires authentication)
 */
router.get('/posts', auth, async (req, res) => {
  try {
    // Fetch all posts with status 'posted'
    // You might want to add pagination, filtering by user, or sorting later
    const posts = await Post.find({ status: 'posted' })
                            .populate('userId', 'username') // Populate username from User model
                            .sort({ postedTime: -1 }); // Sort by most recent posted time

    res.status(200).json({
      message: 'Successfully fetched simulated feed posts.',
      posts: posts
    });

  } catch (error) {
    console.error('Error fetching simulated feed posts:', error);
    res.status(500).json({ message: 'Server error fetching feed posts', error: error.message });
  }
});

module.exports = router;
