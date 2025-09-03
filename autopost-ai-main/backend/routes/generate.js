// backend/routes/generate.js
const express = require('express');
const Joi = require('joi'); // For input validation
const auth = require('../middleware/auth'); // Assuming you'll have an authentication middleware
const openaiService = require('../openai');
const Post = require('../models/Post'); // Import the Post model
const User = require('../models/User'); // Import the User model

const router = express.Router();

// Joi schema for validating post generation requests
const generatePostSchema = Joi.object({
  occasion: Joi.string().trim().max(100).required(),
  category: Joi.string().valid('college', 'business', 'ngo').required(),
  audience: Joi.string().trim().required(),
  customPrompt: Joi.string().trim().allow(null, '') // Optional custom prompt
});

/**
 * @route POST /api/generate/post
 * @description Generate a new Instagram post (caption + image) using AI
 * @access Private (requires authentication)
 */
router.post('/post', auth, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = generatePostSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { occasion, category, audience, customPrompt } = value;
    const userId = req.user.id; // Assuming auth middleware adds user ID to req.user

    console.log(`Generating post for occasion: ${occasion}, category: ${category}, audience: ${audience}`);

    // Generate the complete post using OpenAI service - FIXED FUNCTION NAME
    const generatedContent = await openaiService.generatePostContent(
      occasion,
      category,
      audience,
      customPrompt
    );

    console.log('Generated content received:', {
      hasCaption: !!generatedContent.caption,
      hasImageUrl: !!generatedContent.imageUrl,
      imageUrl: generatedContent.imageUrl
    });

    // Validate that we have required content
    if (!generatedContent.caption) {
      throw new Error('Failed to generate caption');
    }

    if (!generatedContent.imageUrl) {
      throw new Error('Failed to generate or set image URL');
    }

    // Validate generated content against Instagram guidelines (if the function exists)
    let issues = [];
    try {
      const validation = openaiService.validateContent(generatedContent.caption);
      if (!validation.isValid) {
        console.warn(`Generated content has validation issues for user ${userId}:`, validation.issues);
        issues = validation.issues;
      }
    } catch (validationError) {
      console.warn('Content validation function not available or failed:', validationError.message);
    }

    // Ensure we have proper default values for all required fields
    const postData = {
      userId,
      occasion: generatedContent.occasion || occasion,
      caption: generatedContent.caption,
      imageUrl: generatedContent.imageUrl,
      imagePrompt: generatedContent.imagePrompt || null,
      audience: generatedContent.audience || audience,
      category: generatedContent.category || category,
      scheduledTime: new Date(),
      status: 'draft', // Initial status is draft
      metadata: {
        aiModel: generatedContent.metadata?.captionModel || 'gemini-pro',
        generationTime: generatedContent.metadata?.generationTime || 0,
        generationDetails: generatedContent.metadata?.captionUsage || {},
        imageDetails: {
          imageModel: generatedContent.metadata?.imageModel || 'placeholder',
          revisedPrompt: generatedContent.metadata?.revisedPrompt || generatedContent.imagePrompt
        },
        generatedAt: generatedContent.metadata?.generatedAt || new Date()
      }
    };

    console.log('Creating post with data:', {
      userId: postData.userId,
      occasion: postData.occasion,
      captionLength: postData.caption.length,
      imageUrl: postData.imageUrl,
      category: postData.category,
      audience: postData.audience
    });

    // Create a new Post document in the database
    const newPost = new Post(postData);

    // Validate the post before saving
    const validationError = newPost.validateSync();
    if (validationError) {
      console.error('Post validation failed:', validationError.message);
      throw validationError;
    }

    await newPost.save();

    console.log('Post saved successfully with ID:', newPost._id);

    res.status(201).json({
      message: 'Post generated successfully!',
      post: newPost,
      validationIssues: issues // Return validation issues if any
    });

  } catch (error) {
    console.error('Error generating post:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate post';
    if (error.name === 'ValidationError') {
      errorMessage = 'Post data validation failed';
      console.error('Validation errors:', error.errors);
    } else if (error.message.includes('AI service')) {
      errorMessage = 'AI service is currently unavailable';
    }

    res.status(500).json({ 
      message: errorMessage, 
      error: error.message,
      details: error.errors || null
    });
  }
});

/**
 * @route GET /api/generate/options
 * @description Get available options for occasion, category, audience
 * @access Public (or Private, depending on app design)
 * This is a placeholder; you might fetch these from a database or config
 */
router.get('/options', (req, res) => {
  const categories = ['college', 'business', 'ngo'];
  const audiences = ['general', 'students', 'professionals', 'community']; // Example audiences
  // This list must match the enum in backend/models/Post.js
  const occasions = [
    'Daily Motivation',
    'Product Launch',
    'Event Promotion',
    'Behind the Scenes',
    'Customer Spotlight',
    'Holiday Greeting',
    'Educational Tip',
    'Q&A Session',
    'Team Introduction',
    'Success Story',
    'Call for Volunteers',
    'Fundraising Appeal',
    'Announcement',
    'Milestone',
    'Giveaway',
    'Contest',
    'Tutorial',
    'Live Session',
    'Testimonial',
    'Community Highlight',
    'Product Update',
    'Service Spotlight',
    'Event Recap',
    'Throwback'
  ];

  res.json({
    categories,
    audiences,
    occasions
  });
});

module.exports = router;