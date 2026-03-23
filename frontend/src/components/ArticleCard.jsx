import { useState } from 'react';
import './ArticleCard.css';

function ArticleCard({ article, delay }) {
  const [expanded, setExpanded] = useState(!!article.featured);

  return (
    <article
      className={`article-card ${article.featured ? 'featured' : ''} ${expanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Featured badge */}
      {article.featured && (
        <div className="article-featured-badge">
          <span className="featured-star">✦</span>
          <div>
            <span className="featured-label">Author's Note</span>
            <span className="featured-byline">Written by Henry Zhu Yufan</span>
          </div>
        </div>
      )}

      {/* Title + expand toggle */}
      <div className="article-header" onClick={() => setExpanded(!expanded)}>
        <h3 className="article-title">{article.name}</h3>
        <button className="expand-btn" aria-label={expanded ? 'Collapse' : 'Expand'}>
          {expanded ? '−' : '+'}
        </button>
      </div>

      {/* Metadata */}
      <div className="article-meta">
        {article.ruler && (
          <span className="meta-chip">
            <span className="chip-icon">👑</span> {article.ruler}
          </span>
        )}
        {article.capital && (
          <span className="meta-chip">
            <span className="chip-icon">🏛</span> {article.capital}
          </span>
        )}
        {article.population_estimate && (
          <span className="meta-chip">
            <span className="chip-icon">👥</span> {article.population_estimate}
          </span>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="article-body">
          <p className="article-summary">{article.summary}</p>

          {article.key_events?.length > 0 && (
            <div className="article-events">
              <h4 className="events-title">Key Events</h4>
              <ul className="events-list">
                {article.key_events.map((evt, i) => (
                  <li key={i} className="event-item">
                    <span className="event-dot" />
                    {evt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.did_you_know && (
            <div className="article-factoid">
              <strong>Did you know?</strong>
              <p>{article.did_you_know}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default ArticleCard;
