'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchWithSerper } from '@/lib/serper-service';
import { SearchResult } from '@/components/search/result-card';

const contentTypes = [
  { value: 'all', label: 'All' },
  { value: 'pdf', label: 'PDF' },
  { value: 'ppt', label: 'PPT' },
  { value: 'docx', label: 'DOCX' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
];

interface SearchResultsProps {
  query: string;
  selectedType: string;
  selectedDifficulty: string;
}

export function SearchResults({ query, selectedType, selectedDifficulty }: SearchResultsProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeType, setActiveType] = useState(selectedType || 'all');
  const [activeDifficulty, setActiveDifficulty] = useState(selectedDifficulty || 'all');
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        // Pass the activeType and activeDifficulty to the searchWithSerper function
        const searchResults = await searchWithSerper(
          query,
          activeType !== 'all' ? activeType : undefined,
          activeDifficulty !== 'all' ? activeDifficulty : undefined
        );
        setResults(searchResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query, activeType, activeDifficulty]);

  const handleTypeChange = (value: string) => {
    setActiveType(value);
    router.push(`/search?q=${query}&type=${value}&difficulty=${activeDifficulty}`);
  };

  const handleDifficultyChange = (value: string) => {
    setActiveDifficulty(value);
    router.push(`/search?q=${query}&type=${activeType}&difficulty=${value}`);
  };

  if (!query) return null;

  const filteredResults = activeType === 'all'
    ? results
    : results.filter(result => {
        if (activeType === 'video') return result.type === 'video';
        if (activeType === 'image') return result.type === 'image';
        return result.type?.toLowerCase() === activeType;
      });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {loading ? 'Searching...' : `Results for "${query}"`}
        </h2>

        <div className="flex gap-4">
          <Tabs value={activeType} onValueChange={handleTypeChange}>
            <TabsList>
              {contentTypes.map(type => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Tabs value={activeDifficulty} onValueChange={handleDifficultyChange}>
            <TabsList>
              {['all', 'basic', 'intermediate', 'advanced'].map(level => (
                <TabsTrigger key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2">
          {filteredResults.map(result => (
            <Card key={result.id} className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{result.title}</h3>
                  <p className="text-muted-foreground">{result.summary}</p>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{result.source}</Badge>
                    <Badge variant="outline">{result.type}</Badge>
                    {result.year && <Badge variant="outline">{result.year}</Badge>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {result.type === 'youtube' ? (
                    <Button asChild variant="outline" className="bg-red-50 hover:bg-red-100 border-red-200">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        Watch Video
                      </a>
                    </Button>
                  ) : result.type === 'pdf' ? (
                    <Button asChild variant="outline" className="bg-orange-50 hover:bg-orange-100 border-orange-200">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        View PDF
                      </a>
                    </Button>
                  ) : result.type === 'ppt' ? (
                    <Button asChild variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        View Presentation
                      </a>
                    </Button>
                  ) : result.type === 'docx' ? (
                    <Button asChild variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        View Document
                      </a>
                    </Button>
                  ) : result.type === 'image' ? (
                    <Button asChild variant="outline" className="bg-purple-50 hover:bg-purple-100 border-purple-200">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        View Image
                      </a>
                    </Button>
                  ) : (
                    <Button asChild variant="outline">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        View Source
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
