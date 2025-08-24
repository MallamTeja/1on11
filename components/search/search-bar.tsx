'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
}

export function SearchBar({ initialQuery = '', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for academic topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-24 h-12 rounded-full pl-5 shadow-md focus-visible:ring-primary"
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
  );
}