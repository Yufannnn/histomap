import { useState, useEffect } from 'react';
import ArticleFeed from './components/ArticleFeed.jsx';
import ArticleReader from './components/ArticleReader.jsx';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [filterTag, setFilterTag] = useState(null);

  useEffect(() => {
    const url = filterTag ? `/api/articles?tag=${filterTag}` : '/api/articles';
    fetch(url)
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {});
  }, [filterTag]);

  const allTags = [...new Set(articles.flatMap((a) => a.tags))].sort();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left" onClick={() => { setSelectedSlug(null); setFilterTag(null); }} style={{ cursor: 'pointer' }}>
          <span className="header-logo">HISTOMAP</span>
          <div className="header-divider" />
          <span className="header-tagline">Thoughts on history</span>
        </div>
        <div className="header-right">
          <span className="header-credit">by Henry Zhu Yufan</span>
        </div>
      </header>

      {selectedSlug ? (
        <ArticleReader
          slug={selectedSlug}
          onBack={() => setSelectedSlug(null)}
          onTagClick={(tag) => { setSelectedSlug(null); setFilterTag(tag); }}
        />
      ) : (
        <main className="main-content">
          {/* Tag filter bar */}
          {allTags.length > 0 && (
            <div className="tag-bar">
              <button
                className={`tag-chip ${!filterTag ? 'active' : ''}`}
                onClick={() => setFilterTag(null)}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-chip ${filterTag === tag ? 'active' : ''}`}
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <ArticleFeed
            articles={articles}
            onSelect={setSelectedSlug}
          />
        </main>
      )}
    </div>
  );
}

export default App;
