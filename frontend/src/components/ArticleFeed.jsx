import './ArticleFeed.css';

function ArticleFeed({ articles, onSelect }) {
  if (articles.length === 0) {
    return <p className="feed-empty">No articles yet. Drop a .md file in backend/data/articles/ to get started.</p>;
  }

  return (
    <div className="feed">
      {articles.map((article, i) => (
        <article
          key={article.slug}
          className={`feed-card ${article.featured ? 'featured' : ''}`}
          onClick={() => onSelect(article.slug)}
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {article.featured && (
            <div className="feed-featured-badge">
              <span className="badge-star">✦</span> Featured
            </div>
          )}

          <h2 className="feed-title">{article.title}</h2>

          <p className="feed-excerpt">{article.excerpt}</p>

          <div className="feed-footer">
            <div className="feed-meta">
              {article.date && <span className="feed-date">{article.date}</span>}
              {article.era && <span className="feed-era">{article.era}</span>}
              <span className="feed-reading">{article.readingTime}</span>
            </div>
            <div className="feed-tags">
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="feed-tag">{tag}</span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ArticleFeed;
