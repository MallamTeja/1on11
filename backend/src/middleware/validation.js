import { createError } from './errorHandler';

/**
 * Validates search query parameters
 */
export const validateSearchQuery = (req, res, next) => {
  const { query } = req.query;
  
  // Check if query parameter exists
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return next(createError(400, 'Search query is required'));
  }
  
  // Validate limit
  if (req.query.limit) {
    const limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1 || limit > 50) {
      return next(createError(400, 'Limit must be a number between 1 and 50'));
    }
  }
  
  // Validate sortBy
  if (req.query.sortBy && !['relevance', 'date'].includes(req.query.sortBy)) {
    return next(createError(400, 'sortBy must be either "relevance" or "date"'));
  }
  
  next();
};

/**
 * Validates API key in the request headers
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(createError(401, 'Invalid or missing API key'));
  }
  
  next();
};
