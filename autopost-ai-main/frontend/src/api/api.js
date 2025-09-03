import axios from 'axios';

// Create an Axios instance with base URL.
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'https://autopost-ai-2if0.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 📌 Set the token globally for all future requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('jwtToken', token); // Save token to localStorage
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('jwtToken'); // Remove token from localStorage
  }
};

// ============================
// 🔐 Auth APIs
// ============================
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');
export const updateUserPreferences = (preferencesData) =>
  api.put('/auth/update-preferences', preferencesData);

// ============================
// 📝 Post Generation APIs
// ============================
export const generatePost = (postData) => api.post('/generate/post', postData);
export const getGenerationOptions = () => api.get('/generate/options');

// ============================
// 📅 Scheduler APIs
// ============================
export const getPosts = (status = '', page = 1, limit = 10) =>
  api.get(`/scheduler/posts?status=${status}&page=${page}&limit=${limit}`);

export const getPostById = (postId) => api.get(`/scheduler/posts/${postId}`);

export const schedulePost = (postId, scheduledTime) =>
  api.post('/scheduler/schedule-post', { postId, scheduledTime });

export const updatePost = (postId, updateData) =>
  api.put(`/scheduler/update-post/${postId}`, updateData);

export const deletePost = (postId) =>
  api.delete(`/scheduler/delete-post/${postId}`);

export const getOptimalPostingTimes = () =>
  api.get('/scheduler/optimal-times');

export const triggerDailyGeneration = () =>
  api.post('/scheduler/trigger-daily-generation');

export const triggerPostProcessing = () =>
  api.post('/scheduler/trigger-post-processing');

// ✅ NEW: Get today’s scheduled posts (to display before actual posting)
export const getTodayScheduledPosts = () =>
  api.get('/scheduler/today-scheduled-posts');

// ✅ NEW: Get upcoming special days
export const getUpcomingSpecialDays = () =>
  api.get('/scheduler/upcoming-special-days');

// ============================
// 🔁 Feed Simulation API
// ============================
export const getSimulatedFeedPosts = () => api.get('/feed/posts');

// ============================
// 🩺 Health Check
// ============================
export const getHealthCheck = () => api.get('/health');

// Export instance (for advanced usage)
export default api;