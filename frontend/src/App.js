import React, { useState } from 'react';
import './App.css';
import { scholarApi } from './services/api';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await scholarApi.search(query, {
        limit: 10,
        sortBy: 'relevance',
        indianOnly: false
      });
      setResults(searchResults);
    } catch (err) {
      setError(err.message || 'Failed to fetch search results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (result) => (
    <div key={result.id} className="result-item">
      <h3>
        <a href={result.link} target="_blank" rel="noopener noreferrer">
          {result.title}
        </a>
      </h3>
      <div className="result-meta">
        {result.authors?.length > 0 && (
          <span className="authors">{result.authors.join(', ')}</span>
        )}
        {result.year && <span className="year">{result.year}</span>}
        {result.citationCount > 0 && (
          <span className="citations">Citations: {result.citationCount}</span>
        )}
      </div>
      <p className="snippet">{result.snippet}</p>
      {result.pdfLink && (
        <a href={result.pdfLink} className="pdf-link" target="_blank" rel="noopener noreferrer">
          View PDF
        </a>
      )}
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Scholar Search</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for research papers..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      <main className="main-content">
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : results.length > 0 ? (
          <div className="results-container">
            <h2>Search Results</h2>
            <div className="results-list">{results.map(renderResult)}</div>
          </div>
        ) : query ? (
          <div className="no-results">No results found for "{query}"</div>
        ) : (
          <div className="welcome-message">
            <h2>Welcome to Scholar Search</h2>
            <p>Enter a search term to find academic papers and research materials.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Scholar Search</p>
      </footer>
    </div>
  );
}

export default App;
