import React, { useState, useEffect } from 'react';
import { searchScholar, ScholarResult, formatAuthors, formatCitationCount } from '../../services/scholarApi';

interface ScholarSearchProps {
  initialQuery?: string;
  onSearch?: (query: string, results: ScholarResult[]) => void;
  className?: string;
}

const ScholarSearch: React.FC<ScholarSearchProps> = ({ 
  initialQuery = '', 
  onSearch,
  className = '' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScholarResult[]>([]);
  const [filters, setFilters] = useState({
    startYear: '',
    endYear: new Date().getFullYear().toString(),
    sortBy: 'relevance' as 'relevance' | 'date',
    includeCitations: true,
    includePatents: false,
    includeBooks: true,
    includeCaseLaw: false,
  });

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchOptions = {
        ...filters,
        startYear: filters.startYear ? parseInt(filters.startYear) : undefined,
        endYear: filters.endYear ? parseInt(filters.endYear) : undefined,
      };

      const searchResults = await searchScholar(query, searchOptions);
      setResults(searchResults);
      onSearch?.(query, searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search when component mounts with initial query
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for academic papers, articles, and more..."
            className="flex-1 input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="btn btn-primary px-6"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Year
              </label>
              <input
                type="number"
                value={filters.startYear}
                onChange={(e) => setFilters({...filters, startYear: e.target.value})}
                placeholder="From"
                className="input"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Year
              </label>
              <input
                type="number"
                value={filters.endYear}
                onChange={(e) => setFilters({...filters, endYear: e.target.value})}
                placeholder="To"
                className="input"
                min={filters.startYear || '1900'}
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value as 'relevance' | 'date'})}
                className="input"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Most Recent</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  const newFilters = {
                    ...filters,
                    includeCitations: !filters.includeCitations,
                  };
                  setFilters(newFilters);
                }}
                className={`btn ${filters.includeCitations ? 'btn-secondary' : 'btn-outline'} w-full`}
              >
                {filters.includeCitations ? 'With Citations' : 'Any'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <ul className="space-y-6">
            {results.map((result) => (
              <li key={result.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  <a href={result.link} target="_blank" rel="noopener noreferrer">
                    {result.title}
                  </a>
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formatAuthors(result.authors)}
                  {result.publicationInfo && (
                    <span className="ml-2">• {result.publicationInfo}</span>
                  )}
                  {result.year && (
                    <span className="ml-2">• {result.year}</span>
                  )}
                </p>
                
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {result.snippet}
                </p>
                
                <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  {result.citationCount > 0 && (
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {formatCitationCount(result.citationCount)} citations
                    </span>
                  )}
                  
                  {result.pdfLink && (
                    <a 
                      href={result.pdfLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF Available
                    </a>
                  )}
                  
                  {result.isFreeAccess && (
                    <span className="inline-flex items-center text-green-600 dark:text-green-400">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free Access
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : query && !isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No results found for "{query}"</p>
            <p className="mt-2 text-sm">Try different keywords or adjust your filters</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ScholarSearch;
