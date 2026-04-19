import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import './WritingPage.css';

function WritingPage() {
  const { slug } = useParams();
  const [writing, setWriting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/writings/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setWriting(data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="writing-page">
        <div className="writing-loading">Loading...</div>
      </div>
    );
  }

  if (!writing) {
    return (
      <div className="writing-page">
        <div className="writing-not-found">
          <h2>Writing not found</h2>
          <Link to="/writings" className="back-link">Back to writings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="writing-page">
      <nav className="writing-nav">
        <Link to="/" className="back-link">阅读档案馆</Link>
        <span className="nav-sep">/</span>
        <Link to="/writings" className="back-link">Writings</Link>
        <span className="nav-sep">/</span>
        <span className="nav-current">{writing.title}</span>
      </nav>

      <article className="writing-article">
        <div className="writing-meta">
          {writing.tags?.map((tag) => (
            <span key={tag} className="writing-tag">{tag}</span>
          ))}
        </div>

        <div className="writing-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt, ...props }) => (
                <figure className="writing-figure">
                  <img
                    src={src?.startsWith('images/') ? `/writings/${src}` : src}
                    alt={alt}
                    loading="lazy"
                    {...props}
                  />
                  {alt && <figcaption>{alt}</figcaption>}
                </figure>
              ),
              blockquote: ({ children }) => (
                <blockquote className="writing-blockquote">{children}</blockquote>
              ),
              h1: ({ children }) => <h1 className="writing-h1">{children}</h1>,
              h2: ({ children }) => <h2 className="writing-h2">{children}</h2>,
              h3: ({ children }) => <h3 className="writing-h3">{children}</h3>,
              hr: () => <hr className="writing-hr" />,
              p: ({ children }) => <p className="writing-p">{children}</p>,
            }}
          >
            {writing.content}
          </ReactMarkdown>
        </div>
      </article>

      <footer className="writing-footer">
        <Link to="/writings" className="back-link">Back to all writings</Link>
      </footer>
    </div>
  );
}

export default WritingPage;
