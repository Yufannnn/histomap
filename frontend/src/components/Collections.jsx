import './Collections.css';

// Auto-generate collections from tags
function buildCollections(articles) {
  const tagMap = {};
  for (const article of articles) {
    for (const tag of article.tags) {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push(article);
    }
  }

  // Only show tags with 1+ articles, sorted by count
  return Object.entries(tagMap)
    .map(([tag, arts]) => ({
      tag,
      title: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' '),
      articles: arts,
    }))
    .sort((a, b) => b.articles.length - a.articles.length);
}

const COLLECTION_ICONS = {
  rome: '🏛', empire: '👑', decline: '📉', war: '⚔️', battle: '⚔️',
  trade: '🚢', medieval: '🏰', cavalry: '🐎', 'hot-take': '🔥',
  misconceptions: '❓', global: '🌍', hungary: '🇭🇺',
  default: '📜',
};

function Collections({ articles }) {
  const collections = buildCollections(articles);

  return (
    <div className="collections-room">
      <div className="coll-header">
        <h1 className="coll-title">Collections</h1>
        <p className="coll-desc">Articles grouped by theme</p>
        <div className="coll-rule" />
      </div>

      {collections.length === 0 ? (
        <p className="coll-empty">Add tags to your articles to create collections.</p>
      ) : (
        <div className="coll-grid">
          {collections.map((coll) => {
            const icon = COLLECTION_ICONS[coll.tag] || COLLECTION_ICONS.default;
            return (
              <div key={coll.tag} className="coll-card">
                <div className="coll-icon">{icon}</div>
                <h2 className="coll-name">{coll.title}</h2>
                <span className="coll-count">{coll.articles.length} article{coll.articles.length > 1 ? 's' : ''}</span>
                <ul className="coll-list">
                  {coll.articles.map((a) => (
                    <li key={a.slug} className="coll-item">
                      {a.featured && <span className="coll-star">✦</span>}
                      {a.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Collections;
