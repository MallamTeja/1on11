import React from 'react';
import { Helmet } from 'react-helmet';
import ScholarSearch from '../components/scholar/ScholarSearch';

const ScholarPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>Academic Search | ScholarSearch</title>
        <meta 
          name="description" 
          content="Search for academic papers, research articles, and scholarly resources" 
        />
      </Helmet>
      
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Academic Search
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover research papers, academic articles, and scholarly resources
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <ScholarSearch />
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Powered by academic databases and search APIs. Results may vary based on availability.
        </p>
      </footer>
    </div>
  );
};

export default ScholarPage;
