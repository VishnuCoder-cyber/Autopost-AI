const cron = require('node-cron');
const Post = require('../models/Post');
const User = require('../models/User');
const openaiService = require('../openai');
const unsplashService = require('../unsplash'); // Although not used in provided 'generateAndSchedulePost', keeping for completeness
const logger = require('../config/logger');
const specialDates = require('../data/specialDates');

// Helper: Get current IST time as string for clearer logs
const getISTTime = () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

/**
 * Helper function to get the next occurrence of a yearly event.
 * This function returns a Date object representing the *start of the day* in UTC
 * for the next occurrence.
 * @param {number} month - 1-indexed month (e.g., 7 for July).
 * @param {number} day - Day of the month.
 * @param {number} currentYear - The current year.
 * @returns {Date} - The Date object for the start of the day of the next occurrence, in UTC.
 */
const getNextYearlyOccurrence = (month, day, currentYear) => {
  let date = new Date(Date.UTC(currentYear, month - 1, day, 0, 0, 0, 0)); // Start of the day in UTC
  const nowUTC = new Date(new Date().toISOString()); // Current UTC time

  // Compare only date parts to determine if it's in the past
  const eventDayUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const todayUTC = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate()));

  if (eventDayUTC.getTime() < todayUTC.getTime()) {
    date.setUTCFullYear(currentYear + 1);
  }
  return date;
};

/**
 * Helper function to calculate the date for a weekly/monthly recurring post.
 * This function returns a Date object representing the *start of the day* in UTC
 * for the next occurrence.
 * @param {Date} baseDate - The date from which to calculate (e.g., today's date).
 * @param {Object} specialDate - The specialDate object with recurringType, dayOfWeek, dayOfMonth.
 * @returns {Date|null} - The calculated Date for the start of the day of the post, in UTC, or null if not applicable.
 */
function getRecurringPostDate(baseDate, specialDate) {
  const date = new Date(baseDate); // Clone to avoid modifying original
  date.setHours(0, 0, 0, 0); // Set to 12:00 AM local for initial calculation

  if (specialDate.recurringType === 'weekly' && specialDate.dayOfWeek !== undefined) {
    const currentDay = date.getDay(); // 0 for Sunday, 1 for Monday (local day)
    const diff = specialDate.dayOfWeek - currentDay;
    date.setDate(date.getDate() + diff);

    // If the calculated date is in the past (local time, just the day), move to next week
    if (date.getTime() < new Date().setHours(0, 0, 0, 0)) { // Compare only date parts
      date.setDate(date.getDate() + 7);
    }
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)); // Convert to UTC start of day
  } else if (specialDate.recurringType === 'monthly' && specialDate.dayOfMonth !== undefined) {
    if (specialDate.dayOfMonth === -1) { // Last day of the month
      date.setMonth(date.getMonth() + 1, 0); // Set to last day of current month
    } else {
      date.setDate(specialDate.dayOfMonth);
    }

    // If the calculated date is in the past (local time, just the day), move to next month
    if (date.getTime() < new Date().setHours(0, 0, 0, 0)) { // Compare only date parts
      date.setMonth(date.getMonth() + 1);
      if (specialDate.dayOfMonth === -1) { // If it was last day of month, set to last day of new month
        date.setDate(0);
      }
    }
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)); // Convert to UTC start of day
  }
  return null;
}

/**
 * Generates and schedules a single post.
 * Handles existing posts (deletes drafts/failed, skips scheduled/posted).
 * @param {string} userId
 * @param {string} occasion
 * @param {string} category
 * @param {string} audience
 * @param {string} collegeName
 * @param {string} companyName
 * @param {string} ngoCause
 * @param {Date} scheduledDateForPost - The exact Date object (e.g., 10 AM UTC) when the post should be scheduled.
 * @param {string} customPromptForAI - The specific prompt suffix for AI generation.
 */
async function generateAndSchedulePost(userId, occasion, category, audience, collegeName, companyName, ngoCause, scheduledDateForPost, customPromptForAI) {
  try {
    // Define the start and end of the target day (UTC) for checking existing posts
    const targetDayStartUTC = new Date(Date.UTC(
      scheduledDateForPost.getUTCFullYear(),
      scheduledDateForPost.getUTCMonth(),
      scheduledDateForPost.getUTCDate(),
      0, 0, 0, 0
    ));
    const targetDayEndUTC = new Date(Date.UTC(
      scheduledDateForPost.getUTCFullYear(),
      scheduledDateForPost.getUTCMonth(),
      scheduledDateForPost.getUTCDate(),
      23, 59, 59, 999
    ));

    logger.info(`[GENERATE] Checking "${occasion}" for user ${userId} on ${targetDayStartUTC.toISOString().split('T')[0]}.`);

    const existingPost = await Post.findOne({
      userId,
      occasion,
      scheduledTime: { $gte: targetDayStartUTC, $lte: targetDayEndUTC },
      status: { $in: ['scheduled', 'posting', 'posted'] }
    });

    if (existingPost) {
      logger.info(`[GENERATE] Skipping "${occasion}": Already ${existingPost.status}.`);
      return;
    }

    const deletedPosts = await Post.deleteMany({
      userId,
      occasion,
      scheduledTime: { $gte: targetDayStartUTC, $lte: targetDayEndUTC },
      status: { $in: ['draft', 'failed'] }
    });

    if (deletedPosts.deletedCount > 0) {
      logger.info(`[GENERATE] Deleted ${deletedPosts.deletedCount} old DRAFT/FAILED posts for "${occasion}".`);
    }

    logger.info(`[GENERATE] Attempting AI generation for "${occasion}"...`);

    const context = {
      collegeName,
      companyName,
      ngoCause
    };

    let generatedContent;
    try {
      generatedContent = await openaiService.generatePostContent(occasion, category, audience, customPromptForAI);
      logger.info(`[GENERATE] Content generated successfully for "${occasion}".`);
    } catch (genError) {
      logger.error(`[GENERATE] ❌ AI content generation failed for "${occasion}": ${genError.message}`);
      throw new Error(`Content generation failed: ${genError.message}`);
    }

    const newPost = new Post({
      userId,
      occasion,
      caption: generatedContent.caption,
      imageUrl: generatedContent.imageUrl,
      imagePrompt: generatedContent.imagePrompt,
      audience,
      category,
      status: 'scheduled',
      scheduledTime: scheduledDateForPost,
      metadata: generatedContent.metadata
    });

    await newPost.save();
    logger.info(`[GENERATE] ✅ Scheduled post for "${occasion}" (ID: ${newPost._id}) at ${newPost.scheduledTime.toISOString()}.`);

  } catch (error) {
    logger.error(`[GENERATE] ❌ Failed to schedule "${occasion}" for user ${userId}: ${error.message}.`);

    const failedPost = new Post({
      userId,
      occasion,
      caption: error.message.substring(0, 500),
      imageUrl: 'https://placehold.co/1080x1080/dc3545/ffffff.png?text=Generation+Failed',
      imagePrompt: '',
      audience,
      category,
      status: 'failed',
      scheduledTime: scheduledDateForPost,
      errors: [{ message: error.message, timestamp: new Date() }],
      metadata: {
        aiModel: 'N/A',
        imageModel: 'N/A',
        generationTime: 0,
        revisedPrompt: ''
      }
    });
    await failedPost.save();
    logger.info(`[GENERATE] Post ID: ${failedPost._id} status updated to 'failed'.`);
  }
}

/**
 * Generates automated content for users based on special dates and their preferences.
 * This cron job runs daily (e.g., at 2 AM IST) to prepare posts only for today's special days.
 */
async function generateDailyContent() {
  const currentDateIST = getISTTime();
  logger.info(`--- Starting automated content generation for TODAY's special dates [${currentDateIST}] ---`);
  try {
    const users = await User.find({ 'preferences.autoGeneratePosts': true });

    if (users.length === 0) {
      logger.info('No users with auto-generation enabled. Skipping daily content generation.');
      return;
    }

    const now = new Date(); // Current date and time (local)

    for (const user of users) {
      logger.info(`[DAILY GEN] Processing user: ${user.username} (ID: ${user._id})`);

      const userCategory = user.preferences.defaultCategory;
      const userCategoryDetails = user.preferences.categoryDetails;

      const todaysEvents = [];

      specialDates.forEach(day => {
        const isCategoryRelevant = day.categories.includes('all') || day.categories.includes(userCategory);

        if (!isCategoryRelevant) {
          return;
        }

        let scheduledDateBase = null; // This will hold the UTC date for the start of the day

        if (day.recurringType === 'yearly') {
          scheduledDateBase = getNextYearlyOccurrence(day.month, day.day, now.getFullYear());
          // Ensure it's for today's calendar day in UTC
          if (!(scheduledDateBase.getUTCFullYear() === now.getUTCFullYear() &&
                scheduledDateBase.getUTCMonth() === now.getUTCMonth() &&
                scheduledDateBase.getUTCDate() === now.getUTCDate())) {
            scheduledDateBase = null; // Not today
          }
        } else if (day.recurringType === 'weekly' || day.recurringType === 'monthly') {
          scheduledDateBase = getRecurringPostDate(now, day); // This returns UTC start of day
          // Ensure it's for today's calendar day in UTC
          if (scheduledDateBase && !(scheduledDateBase.getUTCFullYear() === now.getUTCFullYear() &&
                                      scheduledDateBase.getUTCMonth() === now.getUTCMonth() &&
                                      scheduledDateBase.getUTCDate() === now.getUTCDate())) {
            scheduledDateBase = null; // Not today
          }
        }

        if (scheduledDateBase && !isNaN(scheduledDateBase.getTime())) {
            todaysEvents.push({
                occasion: day.occasion,
                scheduledDateBase: scheduledDateBase, // Store as UTC start of day
                category: userCategory,
                audience: user.preferences.defaultAudience,
                collegeName: userCategoryDetails.educational?.collegeName,
                companyName: userCategoryDetails.business?.companyName,
                ngoCause: userCategoryDetails.ngo?.cause,
                promptSuffix: day.promptSuffix
            });
        } else {
            logger.info(`[DAILY GEN] Skipping "${day.occasion}": Not scheduled for today.`);
        }
      });

      // Sort today's events by occasion name to ensure consistent hourly assignment
      todaysEvents.sort((a, b) => a.occasion.localeCompare(b.occasion));

      // Assign hourly times starting from 10:00 AM local time
      let currentHourLocal = 10; // Start at 10 AM local
      let currentMinuteLocal = 0;

      // Get the current local date's timezone offset in minutes.
      // This offset is the difference between UTC and local time (UTC - Local).
      const timezoneOffsetMinutes = now.getTimezoneOffset();

      const eventsToGenerate = [];

      for (const [index, event] of todaysEvents.entries()) {
        // Create a new Date object based on the UTC start of the day for the event
        const scheduledTimeUTC = new Date(
            event.scheduledDateBase.getUTCFullYear(),
            event.scheduledDateBase.getUTCMonth(),
            event.scheduledDateBase.getUTCDate(),
            currentHourLocal - (timezoneOffsetMinutes / 60), // Adjust local hour to UTC hour
            currentMinuteLocal,
            0, 0
        );

        // Log the local time we INTENDED to set, and the actual UTC time
        const intendedLocalTime = new Date(scheduledTimeUTC.getTime() + (timezoneOffsetMinutes * 60 * 1000));
        logger.info(`[DAILY GEN] Intending to schedule "${event.occasion}" at ${intendedLocalTime.toLocaleTimeString()} (Local). Calculated UTC: ${scheduledTimeUTC.toISOString()}`);


        // Only schedule if the calculated UTC time is in the future or now
        if (scheduledTimeUTC.getTime() >= new Date().getTime()) {
            event.scheduledDate = scheduledTimeUTC; // Add the final UTC scheduled time
            eventsToGenerate.push(event); // Add to list for generation
            logger.info(`[DAILY GEN] Assigning time ${intendedLocalTime.toLocaleTimeString()} (Local) / ${scheduledTimeUTC.toISOString()} (UTC) to "${event.occasion}".`);
        } else {
            logger.info(`[DAILY GEN] Skipping "${event.occasion}": Assigned time ${intendedLocalTime.toLocaleTimeString()} (Local) is in the past for today. Will not generate.`);
        }

        currentHourLocal++; // Increment hour for the next post
        // No need to reset currentHourLocal if it goes past 24, as we only care about today's events.
        // If there are more than 14 events, some will be scheduled for past midnight, but they will be skipped by the check above.
      }

      logger.info(`[DAILY GEN] Found ${eventsToGenerate.length} events to GENERATE for user ${user.username} for TODAY.`);

      for (const event of eventsToGenerate) {
        let customPromptForAI = event.promptSuffix || '';

        if (event.collegeName) {
          customPromptForAI += ` Mention ${event.collegeName}.`;
        } else if (event.companyName) {
          customPromptForAI += ` Mention ${event.companyName}.`;
        } else if (event.ngoCause) {
          customPromptForAI += ` Focus on the cause of ${event.ngoCause}.`;
        }

        await generateAndSchedulePost(
          user._id,
          event.occasion,
          event.category,
          event.audience,
          event.collegeName,
          event.companyName,
          event.ngoCause,
          event.scheduledDate, // Use the dynamically assigned scheduledDate
          customPromptForAI
        );
      }
    }
    logger.info('--- Automated content generation for TODAY completed ---');
  } catch (error) {
    logger.error(`[DAILY GEN] Critical error in generateDailyContent (automation): ${error.message}`, error.stack);
  }
}

/**
 * Processes all posts that are scheduled and due for posting.
 */
async function processScheduledPosts() {
  const currentTimeIST = getISTTime();
  logger.info(`--- Starting scheduled posts processing [${currentTimeIST}] ---`);
  try {
    const now = new Date(); // Current server time (UTC)
    logger.info(`[PROCESS] Current server UTC time: ${now.toISOString()}`);

    const postsToProcess = await Post.find({
      status: 'scheduled',
      scheduledTime: { $lte: now }
    }).populate('userId');

    if (postsToProcess.length === 0) {
      logger.info('[PROCESS] No scheduled posts due for processing.');
      return;
    }

    logger.info(`[PROCESS] Found ${postsToProcess.length} posts to process.`);

    for (const post of postsToProcess) {
      try {
        logger.info(`[PROCESS] Processing post ID: ${post._id}, Occasion: "${post.occasion}", Scheduled Time: ${post.scheduledTime.toISOString()}`);

        // Simulate posting, update status and engagement
        post.status = 'posted';
        post.postedTime = new Date();
        post.engagement.likes = Math.floor(Math.random() * 100) + 10;
        post.engagement.comments = Math.floor(Math.random() * 20) + 2;
        post.engagement.shares = Math.floor(Math.random() * 10) + 1;
        post.engagement.impressions = post.engagement.likes * 5;
        post.engagement.reach = post.engagement.likes * 3;
        post.engagement.lastUpdated = new Date();

        await post.save();
        logger.info(`[PROCESS] ✅ Successfully processed post ID: ${post._id}. Status: ${post.status}`);

      } catch (postError) {
        logger.error(`[PROCESS] ❌ Error processing post ${post._id}: ${postError.message}`, postError);
        post.status = 'failed';
        post.errors.push({
          message: postError.message,
          timestamp: new Date(),
          retryCount: (post.errors.length > 0 ? post.errors[post.errors.length - 1].retryCount : 0) + 1
        });
        await post.save();
        logger.info(`[PROCESS] Post ID: ${post._id} status updated to 'failed'.`);
      }
    }
    logger.info('--- Scheduled posts processing completed ---');
  } catch (error) {
    logger.error(`[PROCESS] Critical error in processScheduledPosts: ${error.message}`, error.stack);
  }
}


// --- Scheduled Tasks (Cron Jobs) ---

// 1. Automated content generation and scheduling (runs ONCE per day at 3 AM IST)
// This job prepares posts for "today's" special dates.
cron.schedule('0 3 * * *', () => {
  console.log('✅ CRON JOB TRIGGERED: generateDailyContent()');
  generateDailyContent();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

// 2. Scheduled posts processing (runs every minute)
// This job checks for and "posts" any content whose scheduled time has passed.
cron.schedule('* * * * *', async () => {
  logger.info('🕒 CRON: Running processScheduledPosts cron job (every minute).');
  await processScheduledPosts();
}, {
  timezone: "Asia/Kolkata" // Ensure this cron also respects IST timezone for logging consistency
});


module.exports = {
  generateDailyContent,
  processScheduledPosts,
};