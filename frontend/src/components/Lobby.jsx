import './Lobby.css';

function Lobby({ onEnter, articleCount }) {
  return (
    <div className="lobby">
      <div className="lobby-ambient" />

      <header className="lobby-header">
        <div className="lobby-ornament">✦ ✦ ✦</div>
        <h1 className="lobby-title">HISTOMAP</h1>
        <p className="lobby-subtitle">A Personal History Museum</p>
        <div className="lobby-rule" />
        <p className="lobby-curator">Curated by Henry Zhu Yufan</p>
      </header>

      <div className="lobby-exhibits">
        <div className="exhibit-card" onClick={() => onEnter('library')}>
          <div className="exhibit-icon">📖</div>
          <h2 className="exhibit-name">The Library</h2>
          <p className="exhibit-desc">
            {articleCount} essays & deep dives on history.
            Browse the collection, read at your pace.
          </p>
          <span className="exhibit-enter">Enter →</span>
        </div>

        <div className="exhibit-card" onClick={() => onEnter('timeline')}>
          <div className="exhibit-icon">⏳</div>
          <h2 className="exhibit-name">The Timeline</h2>
          <p className="exhibit-desc">
            Walk through the ages. See where each piece
            fits in the grand sweep of history.
          </p>
          <span className="exhibit-enter">Enter →</span>
        </div>

        <div className="exhibit-card" onClick={() => onEnter('collections')}>
          <div className="exhibit-icon">🗂</div>
          <h2 className="exhibit-name">Collections</h2>
          <p className="exhibit-desc">
            Themed exhibits grouping related articles.
            Empires, battles, trade, ideas.
          </p>
          <span className="exhibit-enter">Enter →</span>
        </div>
      </div>

      <footer className="lobby-footer">
        <p>A place for thoughts on the human story</p>
      </footer>
    </div>
  );
}

export default Lobby;
