import { config } from './config.js';

// Helper function to generate a unique ID for each result
function generateScholarId() {
  return `scholar_${Math.random().toString(36).substring(2, 11)}`;
}

// Helper function to extract publication year from the result
function extractYear(publicationInfo) {
  if (!publicationInfo) return null;
  const yearMatch = publicationInfo.match(/(\d{4})/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
}

// Helper function to extract citation count
function extractCitationCount(citationInfo) {
  if (!citationInfo) return 0;
  const match = citationInfo.match(/(\d+(?:,\d+)*)/);
  return match ? parseInt(match[1].replace(/,/g, '')) : 0;
}

// Map Serper scholar results to our format
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
