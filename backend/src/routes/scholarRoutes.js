import { Router } from 'express';
import { searchScholar } from '../services/scholarService';
import { validateSearchQuery } from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/scholar/search
 * @desc    Search for academic papers
 * @access  Public
 * @query   {string} query - Search query string
 * @query   {number} [limit=10] - Maximum number of results to return
 * @query   {string} [sortBy=relevance] - Sort by 'relevance' or 'date'
 * @query   {boolean} [indianOnly=false] - Filter for Indian sources only
 * @returns {Array} List of search results
 */
router.get('/search', validateSearchQuery, async (req, res, next) => {
  try {
    const { query, limit = 10, sortBy = 'relevance', indianOnly = false } = req.query;
    
    // Call the scholar service
    const results = await searchScholar({
      query,
      limit: parseInt(limit, 10),
      sortBy,
      indianOnly: indianOnly === 'true'
    });
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

export default router;
