'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResults } from '../../components/search/search-results';
import { StickySearchBar } from '../../components/search/sticky-search-bar';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-blue-900 border-b border-blue-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-search text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-blue-400">SkillSync Search</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="/dashboard.html" className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors">
              <i className="fas fa-th-large text-sm"></i>
              <span>Dashboard</span>
            </a>
            <a href="/assignments.html" className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-blue-800 transition-colors">
              <i className="fas fa-tasks text-sm"></i>
              <span>Assignments</span>
            </a>
            <a href="/mentorship.html" className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-blue-800 transition-colors">
              <i className="fas fa-user-graduate text-sm"></i>
              <span>Mentorship</span>
            </a>
            <a href="/chat.html" className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-blue-800 transition-colors">
              <i className="fas fa-comments text-sm"></i>
              <span>Chat</span>
            </a>
            <a href="/profile.html" className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-blue-800 transition-colors">
              <i className="fas fa-user text-sm"></i>
              <span>Profile</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="bg-blue-800/30 border-b border-blue-700 p-6">
        <div className="container mx-auto">
          <StickySearchBar initialQuery={query} />
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        {query ? (
          <SearchResults query={query} type={type} difficulty={difficulty} />
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-search text-blue-400 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Search Academic Resources</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Find research papers, tutorials, videos, and more to enhance your learning journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-spinner fa-spin text-blue-400"></i>
          </div>
          <p className="text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
