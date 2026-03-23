import { useState, useEffect, useRef } from 'react';
import './Search.css';

const CULTURE_COLORS = {
  mediterranean: '#a83232', east_asian: '#c47a1a', south_asian: '#d4952e',
  islamic: '#2d7a45', germanic: '#2a5a8f', steppe: '#6b3a7d',
  mesoamerican: '#1a7a6a', african: '#b85a1a', other: '#8a8070',
};

function Search({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 250);
  }, [query]);

  function handleSelect(result) {
    onSelect(result);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div className={`search-wrapper ${open ? 'open' : ''}`}>
      <button
        className="search-toggle"
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 100);
        }}
        aria-label="Search"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10.5" y1="10.5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="search-panel">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search empires, rulers, events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <div className="search-loading">Searching...</div>}
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((r, i) => (
                <li key={`${r.yearKey}-${r.regionId}-${i}`} className="search-result" onClick={() => handleSelect(r)}>
                  <span className="result-dot" style={{ background: CULTURE_COLORS[r.culture] || '#888' }} />
                  <div className="result-info">
                    <span className="result-name">
                      {r.name}
                      {r.featured && <span className="result-featured">✦</span>}
                    </span>
                    <span className="result-era">{r.era} · {r.subtitle}</span>
                  </div>
                  <span className="result-match">{r.matchField}</span>
                </li>
              ))}
            </ul>
          )}
          {query.length >= 2 && !loading && results.length === 0 && (
            <div className="search-empty">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
