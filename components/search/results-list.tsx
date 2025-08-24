'use client';

import { useState, useEffect } from 'react';
import { ResultCard, SearchResult } from './result-card';
import { searchWithSerper } from '@/lib/serper-service';

interface ResultsListProps {
  query: string;
  type?: string;
  difficulty?: string;
}

export function ResultsList({ query, type = 'all', difficulty = 'all' }: ResultsListProps) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      
      try {
        // Use the Serper API service to get search results with type and difficulty
        const searchResults = await searchWithSerper(
          query,
          type !== 'all' ? type : undefined,
          difficulty !== 'all' ? difficulty : undefined
        );
        setResults(searchResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        // If there's an error, the service will return mock data
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchResults();
    }
  }, [query, type, difficulty]);
  
  if (!query) {
    return null;
  }
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-semibold">
        {loading ? 'Searching...' : `Results for "${query}"`}
      </h2>
      
      {loading ? (
  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
    ))}
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
    {results.map(result => (
      <ResultCard key={result.id} result={result} />
    ))}
  </div>
)}
    </div>
  );
}