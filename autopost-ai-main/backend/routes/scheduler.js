// backend/routes/scheduler.js
const express = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const openaiService = require('../openai');
const { processScheduledPosts, generateDailyContent } = require('../utils/schedulerService');
const specialDates = require('../data/specialDates');

const router = express.Router();

const schedulePostSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
  scheduledTime: Joi.date().iso().min(new Date(new Date().setHours(0, 0, 0, 0))).required()
});

const getPostsByStatusSchema = Joi.object({
  status: Joi.string().valid('draft', 'scheduled', 'posting', 'posted', 'failed').required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

router.get('/today-scheduled-posts', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const posts = await Post.find({
      userId,
      status: 'scheduled',
      scheduledTime: { $gte: startOfDay, $lt: endOfDay },
    })
      .sort({ scheduledTime: 1 })
      .limit(5)
      .select('caption imageUrl scheduledTime category occasion');

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching today’s scheduled posts:', error);
    res.status(500).json({ message: 'Failed to fetch today’s scheduled posts', error: error.message });
  }
});

router.post('/schedule-post', auth, async (req, res) => {
  try {
    const { error, value } = schedulePostSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { postId, scheduledTime } = value;
    const userId = req.user.id;

    const post = await Post.findOne({ _id: postId, userId, status: 'draft' });
    if (!post) return res.status(404).json({ message: 'Post not found or not in draft status.' });

    post.scheduledTime = scheduledTime;
    post.status = 'scheduled';
    await post.save();

    res.status(200).json({ message: 'Post scheduled successfully!', post });
  } catch (error) {
    console.error('Error scheduling post:', error);
    res.status(500).json({ message: 'Failed to schedule post', error: error.message });
  }
});

router.put('/update-post/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatePostSchema = Joi.object({
      caption: Joi.string().trim().max(2200),
      imageUrl: Joi.string().uri(),
      scheduledTime: Joi.date().iso().min(new Date(new Date().setHours(0, 0, 0, 0))).allow(null),
      occasion: Joi.string().trim().max(100),
      category: Joi.string().valid('college', 'business', 'ngo'),
      audience: Joi.string().trim()
    }).min(1);

    const { error, value } = updatePostSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const post = await Post.findOne({ _id: id, userId, status: { $in: ['draft', 'scheduled'] } });
    if (!post) return res.status(404).json({ message: 'Post not found or cannot be updated in its current status.' });

    Object.assign(post, value);
    if (value.scheduledTime !== undefined) {
      post.status = value.scheduledTime ? 'scheduled' : 'draft';
    }

    await post.save();
    res.status(200).json({ message: 'Post updated successfully!', post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
});

router.delete('/delete-post/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findOneAndDelete({
      _id: id,
      userId,
      status: { $in: ['draft', 'scheduled', 'failed'] }
    });

    if (!post) return res.status(404).json({ message: 'Post not found or cannot be deleted in its current status.' });

    res.status(200).json({ message: 'Post deleted successfully!', deletedPostId: id });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
});

router.get('/posts', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { error, value } = getPostsByStatusSchema.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { status, page, limit } = value;
    const skip = (page - 1) * limit;
    const query = { userId };
    if (status) query.status = status;

    const posts = await Post.find(query).sort({ scheduledTime: 1, createdAt: -1 }).skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({ posts, currentPage: page, totalPages: Math.ceil(totalPosts / limit), totalPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

router.get('/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findOne({ _id: id, userId });
    if (!post) return res.status(404).json({ message: 'Post not found or you do not have access to it.' });

    res.status(200).json({ post });
  } catch (error) {
    console.error('Error fetching single post:', error);
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
});

router.get('/optimal-times', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const category = user.preferences.defaultCategory || 'college';
    const optimalTimes = openaiService.getOptimalPostingTimes(category);

    res.status(200).json({ category, optimalTimes });
  } catch (error) {
    console.error('Error fetching optimal posting times:', error);
    res.status(500).json({ message: 'Failed to fetch optimal posting times', error: error.message });
  }
});

router.get('/upcoming-special-days', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const userCategory = user.preferences.defaultCategory;
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const currentYear = todayUTC.getUTCFullYear();

    const commonDays = [];
    const categorySpecificDays = [];

    specialDates
      .filter(date => date.recurringType === 'yearly')
      .forEach(day => {
        let eventDateUTC = new Date(Date.UTC(currentYear, day.month - 1, day.day));
        if (eventDateUTC.getTime() < todayUTC.getTime()) eventDateUTC.setUTCFullYear(currentYear + 1);

        if (eventDateUTC.getTime() >= todayUTC.getTime()) {
          const formattedDay = {
            occasion: day.occasion,
            date: eventDateUTC.toISOString().split('T')[0],
            isToday: eventDateUTC.toISOString().split('T')[0] === todayUTC.toISOString().split('T')[0],
            category: day.categories.includes('all') ? 'All' : day.categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')
          };

          if (day.categories.includes('all')) commonDays.push(formattedDay);
          else if (day.categories.includes(userCategory)) categorySpecificDays.push(formattedDay);
        }
      });

    commonDays.sort((a, b) => new Date(a.date) - new Date(b.date));
    categorySpecificDays.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ commonDays, categorySpecificDays });
  } catch (error) {
    console.error('Error fetching upcoming special days:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming special days', error: error.message });
  }
});

router.post('/trigger-daily-generation', auth, async (req, res) => {
  try {
    console.log('Manual trigger: Running daily content generation.');
    await generateDailyContent();
    res.status(200).json({ message: 'Daily content generation triggered successfully.' });
  } catch (error) {
    console.error('Manual trigger: Daily content generation failed:', error);
    res.status(500).json({ message: 'Failed to trigger daily content generation', error: error.message });
  }
});

router.post('/trigger-post-processing', auth, async (req, res) => {
  try {
    console.log('Manual trigger: Running scheduled post processing.');
    await processScheduledPosts();
    res.status(200).json({ message: 'Scheduled post processing triggered successfully.' });
  } catch (error) {
    console.error('Manual trigger: Scheduled post processing failed:', error);
    res.status(500).json({ message: 'Failed to trigger scheduled post processing', error: error.message });
  }
});

module.exports = router;
