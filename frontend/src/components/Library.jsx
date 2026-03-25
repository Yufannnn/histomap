import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTilt } from '../hooks/useScrollEffects.js';
import './Library.css';

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(Math.min(100, pct));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}

function ShelfBook({ article, index, onSelect }) {
  const ref = useRef(null);
  useTilt(ref, { maxDeg: 3 });

  return (
    <div
      ref={ref}
      className={`shelf-book ${article.featured ? 'featured' : ''}`}
      onClick={onSelect}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className="book-spine" />
      <div className="book-content">
        {article.featured && <div className="book-badge">✦</div>}
        <h3 className="book-title">{article.title}</h3>
        <p className="book-excerpt">{article.excerpt}</p>
        <div className="book-meta">
          {article.era && <span className="book-era">{article.era}</span>}
          <span>{article.readingTime}</span>
        </div>
      </div>
    </div>
  );
}

function Library({ articles }) {
  const [selected, setSelected] = useState(null);

  if (selected !== null && articles[selected]) {
    const article = articles[selected];
    return (
      <div className="library-reader">
        <ReadingProgress />
        <div className="reading-lamp" />
        <div className="book-page">
          <button className="lib-back" onClick={() => setSelected(null)}>
            ← Back to shelf
          </button>

          <header className="lib-header">
            <span className="lib-chapter">Chapter {toRoman(selected + 1)}</span>
            <h1 className="lib-title">{article.title}</h1>
            <div className="lib-meta">
              {article.era && <span className="lib-era">{article.era}</span>}
              {article.date && <span>{article.date}</span>}
              <span>{article.readingTime}</span>
            </div>
            {article.featured && (
              <div className="lib-featured">✦ Author's Note — Written by Henry Zhu Yufan</div>
            )}
            <div className="lib-rule" />
          </header>

          <div className="lib-body">
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>

          <footer className="lib-footer">
            <div className="lib-tags">
              {article.tags.map((t) => <span key={t} className="lib-tag">{t}</span>)}
            </div>
            <div className="lib-nav-btns">
              {selected > 0 && (
                <button className="lib-nav-btn" onClick={() => { setSelected(selected - 1); window.scrollTo({ top: 0 }); }}>
                  ← Previous
                </button>
              )}
              {selected < articles.length - 1 && (
                <button className="lib-nav-btn" onClick={() => { setSelected(selected + 1); window.scrollTo({ top: 0 }); }}>
                  Next →
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="library-shelf">
      <div className="shelf-header">
        <h1 className="shelf-title">The Library</h1>
        <p className="shelf-desc">{articles.length} essays & explorations</p>
        <div className="shelf-rule" />
      </div>

      <div className="shelf-grid">
        {articles.map((article, i) => (
          <ShelfBook
            key={article.slug}
            article={article}
            index={i}
            onSelect={() => { setSelected(i); window.scrollTo({ top: 0 }); }}
          />
        ))}
      </div>
    </div>
  );
}

function toRoman(num) {
  const vals = [10, 9, 5, 4, 1];
  const syms = ['X', 'IX', 'V', 'IV', 'I'];
  let r = '';
  for (let i = 0; i < vals.length; i++) { while (num >= vals[i]) { r += syms[i]; num -= vals[i]; } }
  return r;
}

export default Library;
