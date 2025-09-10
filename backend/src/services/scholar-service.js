import { config } from './config.js';

/**
 * Generate a short, human-readable identifier for a scholar result.
 *
 * Returns a string prefixed with "scholar_" followed by a random base-36 segment
 * (generated from Math.random). Suitable as a lightweight unique ID within a
 * single runtime, but not cryptographically unique across distributed systems.
 *
 * @return {string} A generated identifier like "scholar_k5x9r1a0b".
 */
function generateScholarId() {
  return `scholar_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Extract the first four-digit year found in a publication info string.
 *
 * @param {string|null|undefined} publicationInfo - Text that may contain a year (e.g., "Proc. of X, 2021"). If falsy, no year is extracted.
 * @returns {number|null} The first matched 4-digit year as an integer, or null if none is found.
 */
function extractYear(publicationInfo) {
  if (!publicationInfo) return null;
  const yearMatch = publicationInfo.match(/(\d{4})/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
}

/**
 * Extract a numeric citation count from a citation text.
 *
 * Attempts to find the first integer in `citationInfo` (commas allowed, e.g. "1,234")
 * and returns it as a Number. If `citationInfo` is falsy or no number is found,
 * returns 0.
 *
 * @param {string|null|undefined} citationInfo - Text containing a citation count (e.g. "Cited by 123").
 * @returns {number} The parsed citation count as an integer, or 0 if none found.
 */
function extractCitationCount(citationInfo) {
  if (!citationInfo) return 0;
  const match = citationInfo.match(/(\d+(?:,\d+)*)/);
  return match ? parseInt(match[1].replace(/,/g, '')) : 0;
}

/**
 * Convert a Serper Scholar API response into an array of normalized scholarly result objects.
 *
 * If `data` is missing or does not contain an `organic` array, an empty array is returned.
 *
 * @param {object} data - The raw JSON response from the Serper Scholar API; expected to contain an `organic` array of result items.
 * @param {string} [query] - The original search query (kept for context; not required by the mapper).
 * @return {Array<object>} An array of normalized results. Each object contains:
 *  - id: internal unique id (string)
 *  - title: title string (fallback: 'No title available')
 *  - link: URL string (fallback: '#')
 *  - snippet: result snippet (string)
 *  - authors: array of author objects or names
 *  - publicationInfo: publication string (if available)
 *  - year: integer year or null
 *  - citationCount: integer citation count (defaults to 0)
 *  - pdfLink: URL to PDF or null
 *  - isFreeAccess: boolean
 *  - source: 'scholar'
 *  - type: 'scholarly_article'
 *  - relevance: numeric relevance score (default 0.9)
 */
function mapScholarResults(data, query) {
  if (!data || !data.organic || !Array.isArray(data.organic)) {
    return [];
  }

  return data.organic.map((item) => ({
    id: generateScholarId(),
    title: item.title || 'No title available',
    link: item.link || '#',
    snippet: item.snippet || '',
    authors: item.authors || [],
    publicationInfo: item.cite?.name || '',
    year: extractYear(item.cite?.name || ''),
    citationCount: extractCitationCount(item.citationCount),
    pdfLink: item.pdfLink || null,
    isFreeAccess: item.isFreeAccess || false,
    source: 'scholar',
    type: 'scholarly_article',
    relevance: 0.9, // Default relevance score
  }));
}

/**
 * Search scholarly results via the Serper Scholar API and return normalized results.
 *
 * Performs a Serper Scholar search for the provided query, applying optional filters
 * (year range, document types, sort, and citation requirement), then maps the API
 * response into the module's internal result format.
 *
 * @param {string} query - Search query string.
 * @param {Object} [options] - Optional search modifiers.
 * @param {number|null} [options.startYear=null] - Inclusive start year for a year range filter.
 * @param {number|null} [options.endYear=null] - Inclusive end year for a year range filter.
 * @param {'relevance'|'date'} [options.sortBy='relevance'] - Sort mode; use 'date' to sort by date.
 * @param {boolean} [options.includeCitations=true] - When true, include only results that have citations.
 * @param {boolean} [options.includePatents=false] - When true, include patent results.
 * @param {boolean} [options.includeBooks=true] - When true, include book results.
 * @param {boolean} [options.includeCaseLaw=false] - When true, include case law results.
 * @returns {Promise<Array>} Promise that resolves to an array of normalized scholarly result objects.
 * @throws {Error} If the Serper API key is not configured.
 * @throws {Error} If the Scholar API responds with a non-OK status or the request fails.
 */
export async function searchScholar(query, options = {}) {
  const {
    startYear = null,
    endYear = null,
    sortBy = 'relevance', // 'relevance' or 'date'
    includeCitations = true,
    includePatents = false,
    includeBooks = true,
    includeCaseLaw = false,
  } = options;

  if (!config.serper.apiKey) {
    throw new Error('Serper API key is not configured for scholar search.');
  }

  try {
    // Build the search query with optional parameters
    let searchQuery = query;
    
    // Add year range if specified
    if (startYear || endYear) {
      searchQuery += ` ${startYear || ''}..${endYear || ''}`;
    }

    // Add document type filters
    const typeFilters = [];
    if (includePatents) typeFilters.push('patent');
    if (includeBooks) typeFilters.push('book');
    if (includeCaseLaw) typeFilters.push('case');
    
    if (typeFilters.length > 0) {
      searchQuery += ` ${typeFilters.map(t => `type:${t}`).join(' OR ')}`;
    }

    // Add sorting
    if (sortBy === 'date') {
      searchQuery += ' sort:date';
    }

    // Add citations filter
    if (includeCitations) {
      searchQuery += ' has:citations';
    }

    const response = await fetch('https://google.serper.dev/scholar', {
      method: 'POST',
      headers: {
        'X-API-KEY': config.serper.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: searchQuery,
        gl: 'in', // India as default country
        hl: 'en', // English language
        num: 10,  // Number of results (max 20 for scholar)
      }),
    });

    if (!response.ok) {
      throw new Error(`Scholar API error: ${response.status}`);
    }

    const data = await response.json();
    return mapScholarResults(data, query);
  } catch (error) {
    console.error('Scholar search error:', error);
    throw new Error('Failed to fetch scholar results');
  }
}
