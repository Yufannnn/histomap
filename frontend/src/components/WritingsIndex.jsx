import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WritingsIndex.css';

function WritingsIndex() {
  const [writings, setWritings] = useState([]);

  useEffect(() => {
    fetch('/api/writings')
      .then((r) => r.json())
      .then(setWritings)
      .catch(() => {});
  }, []);

  return (
    <div className="writings-index">
      <nav className="writings-nav">
        <Link to="/" className="back-link">阅读档案馆</Link>
        <span className="nav-sep">/</span>
        <span className="nav-current-label">Writings</span>
      </nav>

      <div className="writings-hero">
        <div className="writings-ornament">✦</div>
        <h1 className="writings-title">Writings</h1>
        <p className="writings-subtitle">
          Essays on history, culture, and the stories behind the game — by Henry Zhu Yufan
        </p>
        <div className="writings-line" />
      </div>

      <div className="writings-list">
        {writings.map((w) => (
          <Link key={w.slug} to={`/writings/${w.slug}`} className="writings-card">
            <div className="card-badge">
              <span className="badge-star">✦</span>
              <span className="badge-label">Essay</span>
            </div>
            <h2 className="card-title">{w.title}</h2>
            <p className="card-subtitle">{w.subtitle}</p>
            <div className="card-tags">
              {w.tags?.map((tag) => (
                <span key={tag} className="card-tag">{tag}</span>
              ))}
            </div>
            <span className="card-read">Read essay →</span>
          </Link>
        ))}
      </div>

      <footer className="writings-footer">
        <Link to="/" className="back-link">← Back to Histomap</Link>
      </footer>
    </div>
  );
}

export default WritingsIndex;
