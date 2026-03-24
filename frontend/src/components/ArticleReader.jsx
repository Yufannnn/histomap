import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './ArticleReader.css';

function ArticleReader({ slug, onBack, onTagClick }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
        window.scrollTo({ top: 0 });
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="reader-loading">
        <div className="reader-skeleton" />
        <div className="reader-skeleton short" />
        <div className="reader-skeleton" />
      </div>
    );
  }

  if (!article) {
    return <div className="reader-error">Article not found.</div>;
  }

  return (
    <article className="reader">
      <button className="reader-back" onClick={onBack}>
        ← Back to articles
      </button>

      <header className="reader-header">
        {article.featured && (
          <div className="reader-featured">
            <span className="rf-star">✦</span>
            <span className="rf-label">Author's Note</span>
            <span className="rf-byline">Written by Henry Zhu Yufan</span>
          </div>
        )}

        <h1 className="reader-title">{article.title}</h1>

        <div className="reader-meta">
          {article.date && <span>{article.date}</span>}
          {article.era && <span className="reader-era">{article.era}</span>}
          <span>{article.readingTime}</span>
        </div>
      </header>

      <div className="reader-body">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>

      {article.tags.length > 0 && (
        <div className="reader-tags">
          {article.tags.map((tag) => (
            <button key={tag} className="reader-tag" onClick={() => onTagClick(tag)}>
              {tag}
            </button>
          ))}
        </div>
      )}

      <button className="reader-back bottom" onClick={onBack}>
        ← Back to articles
      </button>
    </article>
  );
}

export default ArticleReader;
