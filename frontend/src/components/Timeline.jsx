import './Timeline.css';

const ERA_MARKERS = [
  { year: -3000, label: '3000 BC', desc: 'Rise of Egypt & Mesopotamia' },
  { year: -753, label: '753 BC', desc: 'Founding of Rome' },
  { year: -323, label: '323 BC', desc: 'Death of Alexander the Great' },
  { year: -27, label: '27 BC', desc: 'Roman Empire begins' },
  { year: 1, label: '1 AD', desc: 'Dawn of the Common Era' },
  { year: 313, label: '313', desc: 'Edict of Milan — Christianity legalized' },
  { year: 476, label: '476', desc: 'Fall of Western Rome' },
  { year: 622, label: '622', desc: 'Hijra — Birth of Islam' },
  { year: 800, label: '800', desc: 'Charlemagne crowned Emperor' },
  { year: 1000, label: '1000', desc: 'Medieval world at its height' },
  { year: 1066, label: '1066', desc: 'Norman Conquest of England' },
  { year: 1206, label: '1206', desc: 'Genghis Khan unites the Mongols' },
  { year: 1347, label: '1347', desc: 'Black Death reaches Europe' },
  { year: 1453, label: '1453', desc: 'Fall of Constantinople' },
  { year: 1492, label: '1492', desc: 'Columbus reaches the Americas' },
  { year: 1517, label: '1517', desc: 'Protestant Reformation begins' },
  { year: 1776, label: '1776', desc: 'American Declaration of Independence' },
  { year: 1789, label: '1789', desc: 'French Revolution' },
  { year: 1815, label: '1815', desc: 'Battle of Waterloo' },
  { year: 1914, label: '1914', desc: 'World War I begins' },
  { year: 1945, label: '1945', desc: 'End of World War II' },
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
