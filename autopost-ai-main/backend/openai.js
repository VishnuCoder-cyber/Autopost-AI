// backend/openai.js (Now using Gemini API with Unsplash and Cloudinary integration)
const winston = require('winston');
const axios = require('axios'); // For Unsplash API calls
const cloudinary = require('cloudinary').v2; // Import Cloudinary

// Configure Winston logger
const logger = winston.createLogger({ // <--- FIXED: Changed createCreateLogger to createLogger
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// --- Gemini API Configuration ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_MODEL = 'gemini-2.0-flash';

// Base URL for Gemini API (Generative Language API)
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

if (!GEMINI_API_KEY) {
  logger.error('GEMINI_API_KEY is not set in environment variables. AI generation will not work.');
}

// --- Unsplash API Configuration ---
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_BASE_URL = 'https://api.unsplash.com';

if (!UNSPLASH_ACCESS_KEY) {
  logger.warn('UNSPLASH_ACCESS_KEY is not set. Image generation will fall back to placehold.co.');
}

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  logger.error('Cloudinary credentials are not fully set in environment variables. Image upload to Cloudinary will fail.');
}

/**
 * Generates a safe placeholder image URL
 * @param {string} occasion - The occasion for the post
 * @returns {string} - A valid placeholder image URL
 */
function generatePlaceholderImageUrl(occasion) {
  try {
    const cleanText = occasion.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '+');
    const encodedText = encodeURIComponent(cleanText);
    return `https://placehold.co/1080x1080/4f46e5/ffffff.png?text=${encodedText}`;
  } catch (error) {
    logger.warn('Error generating placeholder URL, using fallback:', error.message);
    return 'https://placehold.co/1080x1080/4f46e5/ffffff.png';
  }
}

/**
 * Fetches a random image from Unsplash based on a query.
 * @param {string} query - The search query for the image.
 * @returns {string|null} - The URL of a high-quality image, or null if not found.
 */
async function fetchUnsplashImage(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    logger.warn('Unsplash access key not configured. Skipping Unsplash image fetch.');
    return null;
  }

  // FIX: Ensure query is a string
  const queryString = typeof query === 'string' ? query : String(query);
  if (!queryString.trim()) {
    logger.warn('Unsplash query is empty or invalid. Skipping Unsplash image fetch.');
    return null;
  }

  try {
    logger.info(`Searching Unsplash for image: "${queryString}"`); // Log the actual query string
    const response = await axios.get(`${UNSPLASH_API_BASE_URL}/search/photos`, {
      params: {
        query: queryString, // Use the validated string query
        per_page: 10, // Fetch a few results to pick from
        orientation: 'squarish' // Good for Instagram
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      // Pick a random image from the results
      const randomIndex = Math.floor(Math.random() * response.data.results.length);
      const imageUrl = response.data.results[randomIndex].urls.regular; // Use 'regular' for good quality
      logger.info(`Found Unsplash image: ${imageUrl}`);
      return imageUrl;
    } else {
      logger.info(`No Unsplash images found for query: "${queryString}"`);
      return null;
    }
  } catch (error) {
    logger.error(`Error fetching image from Unsplash for query "${queryString}": ${error.message}`, error.response?.data);
    return null;
  }
}


/**
 * Generates a complete Instagram post (caption and image URL) using Gemini and Unsplash.
 *
 * @param {string} occasion - The occasion for the post (e.g., 'Graduation Ceremony').
 * @param {string} category - The category of the post (e.g., 'college').
 * @param {string} [audience='general'] - The target audience (e.g., 'students'). Now optional/less critical for AI prompt.
 * @param {string} [customPrompt=''] - An optional custom prompt to guide generation.
 * @returns {object} - An object containing generated caption, image URL, and metadata.
 */
async function generatePostContent(occasion, category, audience = 'general', customPrompt = '') {
  logger.info(`Generating post for occasion: ${occasion}, category: ${category}, audience: ${audience}`);

  const startTime = Date.now();
  let caption = '';
  let imageUrl = '';
  let imagePrompt = ''; // This will store the AI-generated image prompt
  let revisedImagePrompt = ''; // This will store the actual prompt used for Unsplash
  let captionResult = null;

  try {
    // --- Step 1: Generate Caption using Gemini Text Model ---
    const captionPrompt = `Generate a creative and engaging Instagram caption and a separate, concise image search query for a "${occasion}" post.
    The post is for a "${category}" context.
    It should be concise, use relevant emojis, and include appropriate hashtags.
    ${customPrompt ? `Also, consider this specific instruction: "${customPrompt}"` : ''}
    The output should be in JSON format with two keys: "caption" (string) and "image_prompt" (string).
    Example: {"caption": "Happy Engineers' Day! #EngineersDay", "image_prompt": "engineers working on a project"}`;

    logger.info(`Sending caption prompt to Gemini: ${captionPrompt.substring(0, 150)}...`);

    const captionPayload = {
      contents: [{ role: "user", parts: [{ text: captionPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 300, // Increased tokens for both caption and image prompt
      },
    };

    const captionResponse = await fetch(`${GEMINI_API_BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(captionPayload),
    });

    if (!captionResponse.ok) {
      const errorData = await captionResponse.json();
      throw new Error(`Gemini caption generation failed: ${captionResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    captionResult = await captionResponse.json();
    
    if (captionResult?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const rawText = captionResult.candidates[0].content.parts[0].text.trim();
      logger.info(`Raw AI response JSON: ${rawText}`); // Log the raw JSON from AI

      // FIX: Robust JSON parsing - remove markdown code block fences if present
      let jsonString = rawText;
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1].trim();
        logger.info('Extracted JSON from markdown code block.');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(jsonString);
      } catch (parseError) {
        logger.error(`Failed to parse JSON from AI response for "${occasion}": ${parseError.message}. Attempted to parse: ${jsonString.substring(0, 100)}...`);
        // Fallback if JSON parsing fails
        caption = `Generated post for ${occasion}. (JSON parse error: ${jsonString.substring(0, 100)}...)`;
        imagePrompt = occasion; // Use occasion as fallback image prompt
        revisedImagePrompt = 'N/A (JSON parse fallback)';
      }

      caption = parsedResponse?.caption || `Generated post for ${occasion}.`;
      imagePrompt = parsedResponse?.image_prompt || occasion; // Get AI-generated image prompt

      logger.info('Caption and image prompt extracted successfully.');
    } else {
      logger.error('Unexpected Gemini response structure: No content received.', JSON.stringify(captionResult, null, 2));
      throw new Error('No caption content received from Gemini - unexpected response structure');
    }

    // Validate caption length
    if (caption.length > 2200) {
      logger.warn(`Generated caption is too long (${caption.length} chars), truncating...`);
      caption = caption.substring(0, 2190) + '...';
    }

    if (!caption || caption.length < 10) {
      throw new Error('Generated caption is too short or empty');
    }

    // FIX: Ensure imagePrompt is a string before passing to fetchUnsplashImage
    const finalImageQuery = typeof imagePrompt === 'string' && imagePrompt.trim() !== '' ? imagePrompt : occasion;
    logger.info(`Final image query for Unsplash: "${finalImageQuery}"`); // Log the final image query

    // --- Step 2: Fetch image from Unsplash or use a placeholder ---
    imageUrl = await fetchUnsplashImage(finalImageQuery);
    revisedImagePrompt = finalImageQuery; // Store the actual query used for Unsplash

    if (!imageUrl) {
      logger.warn('Failed to fetch image from Unsplash. Falling back to placeholder.');
      imageUrl = generatePlaceholderImageUrl(occasion);
      imagePrompt = `Placeholder image used for: ${occasion}`; // Update imagePrompt for failed case
      revisedImagePrompt = 'N/A (Placeholder used)';
    }

    const endTime = Date.now();
    const generationTime = endTime - startTime;

    // Construct the response object with all required fields
    const response = {
      occasion: occasion,
      caption: caption,
      imageUrl: imageUrl,
      imagePrompt: imagePrompt, // This is the AI-generated prompt (or fallback)
      audience: audience,
      category: category,
      metadata: {
        captionModel: GEMINI_TEXT_MODEL,
        imageModel: imageUrl.includes('unsplash.com') ? 'Unsplash API' : 'Placeholder Service',
        generationTime: generationTime,
        captionUsage: captionResult?.usageMetadata || {
          promptTokens: 0,
          candidatesTokens: 0,
          totalTokens: 0
        },
        revisedPrompt: revisedImagePrompt, // This is the actual query sent to Unsplash
        generatedAt: new Date()
      }
    };

    logger.info('Post generation completed successfully', {
      occasion: response.occasion,
      captionLength: response.caption.length,
      imageUrl: response.imageUrl,
      generationTime: response.metadata.generationTime
    });

    return response;

  } catch (error) {
    logger.error('Error in generatePostContent (Gemini/Unsplash/Placeholder):', {
      message: error.message,
      stack: error.stack,
      occasion,
      category,
      audience
    });

    // Provide a fallback response even on error
    const fallbackImageUrl = 'https://placehold.co/1080x1080/dc2626/ffffff.png?text=Generation+Failed';
    
    // If we have a caption but image failed, still return the caption
    if (caption) {
      return {
        occasion: occasion,
        caption: caption,
        imageUrl: fallbackImageUrl,
        imagePrompt: 'Fallback placeholder image due to generation error',
        audience: audience,
        category: category,
        metadata: {
          captionModel: GEMINI_TEXT_MODEL,
          imageModel: 'Fallback Placeholder',
          generationTime: Date.now() - startTime,
          captionUsage: captionResult?.usageMetadata || {},
          revisedPrompt: 'N/A (Error occurred)',
          generatedAt: new Date(),
          error: error.message
        }
      };
    }

    // Re-throw the error if we couldn't generate anything useful
    throw error;
  }
}

/**
 * Validates the generated content against basic Instagram guidelines.
 * @param {string} caption - The generated caption.
 * @returns {object} - { isValid: boolean, issues: string[] }
 */
function validateContent(caption) {
  const issues = [];
  let isValid = true;

  if (!caption || typeof caption !== 'string') {
    issues.push('Caption is missing or invalid.');
    isValid = false;
    return { isValid, issues };
  }

  if (caption.length > 2200) {
    issues.push('Caption exceeds Instagram limit of 2200 characters.');
    isValid = false;
  }

  if (caption.length < 10) {
    issues.push('Caption is too short (minimum 10 characters recommended).');
    isValid = false;
  }

  // Check for common issues
  const problematicPatterns = [
    /\b(buy now|click here|limited time)\b/gi, // Overly promotional
    /(.)\1{4,}/g, // Repeated characters (like aaaaa)
  ];

  problematicPatterns.forEach((pattern, index) => {
    if (pattern.test(caption)) {
      issues.push(`Caption contains potentially problematic pattern ${index + 1}.`);
    }
  });

  return { isValid, issues };
}

/**
 * Placeholder for getting optimal posting times.
 * In a real scenario, this would involve data analysis or external services.
 * @param {string} category - The category to get times for.
 * @returns {Array<string>} - List of optimal times.
 */
function getOptimalPostingTimes(category) {
  const times = {
    college: ['10:00 AM', '02:00 PM', '08:00 PM'],
    business: ['09:00 AM', '01:00 PM', '04:00 PM'],
    ngo: ['11:00 AM', '03:00 PM', '07:00 PM'],
    general: ['12:00 PM', '05:00 PM', '09:00 PM']
  };
  return times[category] || times.general;
}

module.exports = {
  generatePostContent,
  validateContent,
  getOptimalPostingTimes,
};
