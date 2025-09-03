// backend/unsplash.js
const axios = require('axios');
const logger = require('./config/logger'); // Assuming you have a logger configured

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY; // Ensure this is set in your .env

/**
 * Searches Unsplash for an image based on a query.
 * @param {string} query - The search query for the image.
 * @returns {Promise<string>} - The URL of a relevant image, or a placeholder if no image is found.
 */
async function searchImage(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    logger.error('UNSPLASH_ACCESS_KEY is not set in environment variables.');
    return 'https://placehold.co/1080x1080/cccccc/333333.png?text=Image+Missing'; // Placeholder if key is missing
  }

  try {
    logger.info(`Searching Unsplash for query: "${query}"`);
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query: query,
        per_page: 1, // We only need one image
        orientation: 'squarish', // Good for Instagram
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      const imageUrl = response.data.results[0].urls.regular;
      logger.info(`Found Unsplash image: ${imageUrl}`);
      return imageUrl;
    } else {
      logger.warn(`No Unsplash images found for query: "${query}". Returning placeholder.`);
      return `https://placehold.co/1080x1080/eeeeee/333333.png?text=No+Image+Found`; // Generic placeholder
    }
  } catch (error) {
    logger.error(`Error searching Unsplash for "${query}": ${error.message}`);
    // Return a placeholder image on error
    return `https://placehold.co/1080x1080/ff0000/ffffff.png?text=Image+Error`;
  }
}

module.exports = {
  searchImage,
};
