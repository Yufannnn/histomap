import './Timeline.css';

const ERA_MARKERS = [
  { year: -3000, label: '3000 BC', desc: 'First civilizations' },
  { year: -500, label: '500 BC', desc: 'Classical antiquity' },
  { year: 1, label: '1 AD', desc: 'Roman Empire era' },
  { year: 500, label: '500', desc: 'Fall of Rome' },
  { year: 1000, label: '1000', desc: 'Medieval world' },
  { year: 1500, label: '1500', desc: 'Age of exploration' },
  { year: 1800, label: '1800', desc: 'Revolutionary era' },
  { year: 1945, label: '1945', desc: 'End of WWII' },
];

function Timeline({ articles }) {
  // Map articles to their era year for positioning
  const articlesByYear = articles.map((a) => {
    let year = 0;
    const era = (a.era || '').replace(/\s*AD\s*/i, '');
    if (era.includes('BC')) year = -parseInt(era) || 0;
    else year = parseInt(era) || 0;
    return { ...a, eraYear: year };
  }).sort((a, b) => a.eraYear - b.eraYear);

  return (
    <div className="timeline-room">
      <div className="timeline-header">
        <h1 className="timeline-title">The Timeline</h1>
        <p className="timeline-desc">Walk through the ages</p>
        <div className="timeline-rule" />
      </div>

      <div className="timeline-track">
        <div className="timeline-line" />

        {ERA_MARKERS.map((marker, i) => (
          <div key={i} className="timeline-marker">
            <div className="marker-dot" />
            <div className="marker-label">{marker.label}</div>
            <div className="marker-desc">{marker.desc}</div>
          </div>
        ))}

        {articlesByYear.map((article, i) => (
          <div
            key={article.slug}
            className={`timeline-article ${article.featured ? 'featured' : ''} ${i % 2 === 0 ? 'left' : 'right'}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="ta-connector" />
            <div className="ta-card">
              {article.featured && <span className="ta-star">✦</span>}
              <span className="ta-era">{article.era}</span>
              <h3 className="ta-title">{article.title}</h3>
              <p className="ta-excerpt">{article.excerpt}</p>
              <span className="ta-time">{article.readingTime}</span>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="timeline-empty">
          No articles yet. Add .md files to see them placed on the timeline.
        </p>
      )}
    </div>
  );
}

export default Timeline;
