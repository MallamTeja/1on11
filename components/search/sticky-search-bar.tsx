'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StickySearchBarProps {
  initialQuery?: string;
}

export function StickySearchBar({ initialQuery = '' }: StickySearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4 shadow-lg">
      <form onSubmit={handleSearch} className="container mx-auto max-w-3xl">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search for academic topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-24 h-12 rounded-full pl-5"
            autoComplete="off"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 rounded-full px-4 h-10"
          >
            <Search className="h-4 w-4 mr-2" />
            <span>Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
}