import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock search function - replace with actual API call in production
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data - replace with actual API response
      const mockResults = [
        {
          id: 1,
          title: 'Sample Research Paper on ' + query,
          authors: ['Author One', 'Author Two'],
          abstract: 'This is a sample abstract about ' + query + '. It demonstrates the search functionality.',
          year: 2023,
          url: '#',
          pdf: '#',
          citations: 42
        },
        {
          id: 2,
          title: 'Another Paper about ' + query,
          authors: ['Researcher A', 'Researcher B'],
          abstract: 'Another example result for your search: ' + query + '. This shows multiple results.',
          year: 2022,
          url: '#',
          pdf: '#',
          citations: 28
        }
      ];
      
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ScholarSearch</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for research papers..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      <main className="results-container">
        {loading ? (
          <div className="loading">Searching for "{query}"...</div>
        ) : results.length > 0 ? (
          <div className="results-list">
            {results.map((paper) => (
              <div key={paper.id} className="paper-card">
                <h2><a href={paper.url} target="_blank" rel="noopener noreferrer">{paper.title}</a></h2>
                <p className="authors">{paper.authors.join(', ')}</p>
                <p className="year">Published: {paper.year} • Citations: {paper.citations}</p>
                <p className="abstract">{paper.abstract}</p>
                <div className="actions">
                  <a href={paper.url} className="button" target="_blank" rel="noopener noreferrer">View Paper</a>
                  {paper.pdf && <a href={paper.pdf} className="button" target="_blank" rel="noopener noreferrer">PDF</a>}
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <p className="no-results">No results found for "{query}"</p>
        ) : (
          <div className="welcome-message">
            <h2>Welcome to ScholarSearch</h2>
            <p>Enter a search term to find academic papers and research materials.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} ScholarSearch - Academic Research Platform</p>
      </footer>
    </div>
  );
}

export default App;
