import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ScholarPage from './pages/ScholarPage';
import './App.css';

const App: React.FC = () => {
  return (
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <nav className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link 
                    to="/" 
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    ScholarSearch
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/scholar" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Academic Search
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/scholar" element={<ScholarPage />} />
              <Route 
                path="/" 
                element={
                  <div className="text-center py-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Welcome to ScholarSearch
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                      Your gateway to academic research and scholarly articles
                    </p>
                    <Link 
                      to="/scholar" 
                      className="btn btn-primary px-6 py-3 text-lg"
                    >
                      Start Searching
                    </Link>
                  </div>
                } 
              />
            </Routes>
          </main>

          <footer className="bg-white dark:bg-gray-800 mt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
              <p className="text-center text-base text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} ScholarSearch. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
  );
};

export default App;
