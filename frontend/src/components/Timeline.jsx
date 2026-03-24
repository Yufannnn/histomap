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

function parseEraYear(era) {
  if (!era) return null;
  const s = era.trim();
  if (/bc/i.test(s)) return -parseInt(s) || null;
  return parseInt(s.replace(/\s*AD\s*/i, '')) || null;
}

function Timeline({ articles }) {
  // Assign each article a year
  const placed = articles
    .map((a) => ({ ...a, eraYear: parseEraYear(a.era) }))
    .filter((a) => a.eraYear !== null);

  // Build a merged list: markers + articles, sorted by year
  const items = [];

  for (const marker of ERA_MARKERS) {
    items.push({ type: 'marker', year: marker.year, ...marker });
  }

  for (const article of placed) {
    items.push({ type: 'article', year: article.eraYear, article });
  }

  items.sort((a, b) => a.year - b.year);

  let articleIdx = 0;

  return (
    <div className="timeline-room">
      <div className="timeline-header">
        <h1 className="timeline-title">The Timeline</h1>
        <p className="timeline-desc">Walk through the ages</p>
        <div className="timeline-rule" />
      </div>

      <div className="timeline-track">
        <div className="timeline-line" />

        {items.map((item, i) => {
          if (item.type === 'marker') {
            return (
              <div key={`m-${i}`} className="timeline-marker">
                <div className="marker-dot" />
                <div className="marker-label">{item.label}</div>
                <div className="marker-desc">{item.desc}</div>
              </div>
            );
          }

          const side = articleIdx % 2 === 0 ? 'left' : 'right';
          articleIdx++;
          const a = item.article;

          return (
            <div
              key={`a-${a.slug}`}
              className={`timeline-article ${a.featured ? 'featured' : ''} ${side}`}
              style={{ animationDelay: `${articleIdx * 0.1}s` }}
            >
              <div className="ta-connector" />
              <div className="ta-dot" />
              <div className="ta-card">
                {a.featured && <span className="ta-star">✦</span>}
                <span className="ta-era">{a.era}</span>
                <h3 className="ta-title">{a.title}</h3>
                <p className="ta-excerpt">{a.excerpt}</p>
                <span className="ta-time">{a.readingTime}</span>
              </div>
            </div>
          );
        })}
      </div>

      {placed.length === 0 && (
        <p className="timeline-empty">
          No articles with an era tag yet. Add <code>era: 1000 AD</code> to your .md frontmatter.
        </p>
      )}
    </div>
  );
}

export default Timeline;
