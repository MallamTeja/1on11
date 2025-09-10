import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export interface ScholarSearchOptions {
  startYear?: number;
  endYear?: number;
  sortBy?: 'relevance' | 'date';
  includeCitations?: boolean;
  includePatents?: boolean;
  includeBooks?: boolean;
  includeCaseLaw?: boolean;
}

export interface ScholarResult {
  id: string;
  title: string;
  link: string;
  snippet: string;
  authors: string[];
  publicationInfo: string;
  year: number | null;
  citationCount: number;
  pdfLink: string | null;
  isFreeAccess: boolean;
  source: string;
  type: string;
  relevance: number;
}

export const searchScholar = async (
  query: string,
  options: ScholarSearchOptions = {}
): Promise<ScholarResult[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/scholar`, {
      query,
      ...options,
    });
    
    if (response.data.success && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    throw new Error('Invalid response format from server');
  } catch (error: unknown) {
    console.error('Scholar search error:', error);
    const errorMessage = error && 
      typeof error === 'object' && 
      'response' in error && 
      error.response && 
      typeof error.response === 'object' &&
      error.response !== null &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      error.response.data !== null &&
      'error' in error.response.data
        ? String(error.response.data.error)
        : error instanceof Error
          ? error.message
          : 'Failed to fetch scholar results';
    
    throw new Error(errorMessage);
  }
};

export const formatAuthors = (authors: string[]): string => {
  if (!authors || authors.length === 0) return 'Unknown Author';
  if (authors.length <= 2) return authors.join(' & ');
  return `${authors[0]} et al.`;
};

export const formatCitationCount = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};
