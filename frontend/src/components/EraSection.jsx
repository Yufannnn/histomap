import { forwardRef, useEffect, useRef, useState } from 'react';
import ArticleCard from './ArticleCard.jsx';
import './EraSection.css';

const ERA_TEXTURES = [
  'rgba(168, 50, 50, 0.04)',
  'rgba(107, 58, 125, 0.04)',
  'rgba(42, 90, 143, 0.04)',
  'rgba(45, 122, 69, 0.04)',
  'rgba(196, 122, 26, 0.04)',
  'rgba(168, 50, 50, 0.05)',
  'rgba(42, 90, 143, 0.05)',
];

const EraSection = forwardRef(function EraSection({ era, index, narratives }, ref) {
  const [visible, setVisible] = useState(false);
  const innerRef = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sort: featured first, then by name
  const articles = Object.values(narratives).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <section
      ref={ref}
      data-era={era.yearKey}
      className="era-section"
      style={{ background: `linear-gradient(135deg, ${ERA_TEXTURES[index]}, transparent)` }}
    >
      <div ref={innerRef} className={`era-inner ${visible ? 'visible' : ''}`}>
        {/* Era header */}
        <div className="era-header">
          <div className="era-ornament">✦</div>
          <div className="era-year-label">{era.label}</div>
          <h2 className="era-title">{era.subtitle}</h2>
          <div className="era-line" />
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <div className="era-articles">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.region_id}
                article={article}
                delay={i * 0.08}
              />
            ))}
          </div>
        ) : (
          <p className="era-empty">No articles for this era yet. Check back soon.</p>
        )}
      </div>
    </section>
  );
});

export default EraSection;
