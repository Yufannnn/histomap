import { useEffect, useState } from 'react';
import './Lobby.css';

function Lobby({ onEnter, articleCount }) {
  const [phase, setPhase] = useState(0); // 0=dark, 1=title, 2=subtitle, 3=cards

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="lobby">
      {/* Floating dust particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              opacity: 0.15 + Math.random() * 0.2,
            }}
          />
        ))}
      </div>

      <div className="lobby-ambient" />

      <header className="lobby-header">
        <div className={`lobby-ornament ${phase >= 1 ? 'visible' : ''}`}>✦ ✦ ✦</div>

        <h1 className={`lobby-title ${phase >= 1 ? 'visible' : ''}`}>
          {'HISTOMAP'.split('').map((ch, i) => (
            <span key={i} className="title-letter" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
              {ch}
            </span>
          ))}
        </h1>

        <p className={`lobby-subtitle ${phase >= 2 ? 'visible' : ''}`}>
          A Personal History Museum
        </p>

        <div className={`lobby-rule ${phase >= 2 ? 'visible' : ''}`} />

        <p className={`lobby-curator ${phase >= 2 ? 'visible' : ''}`}>
          Curated by Henry Zhu Yufan
        </p>
      </header>

      <div className={`lobby-exhibits ${phase >= 3 ? 'visible' : ''}`}>
        <div className="exhibit-card" onClick={() => onEnter('library')} style={{ animationDelay: '0s' }}>
          <div className="exhibit-icon">📖</div>
          <h2 className="exhibit-name">The Library</h2>
          <p className="exhibit-desc">
            {articleCount} essays & deep dives on history.
            Browse the collection, read at your pace.
          </p>
          <span className="exhibit-enter">Enter →</span>
        </div>

        <div className="exhibit-card" onClick={() => onEnter('timeline')} style={{ animationDelay: '0.12s' }}>
          <div className="exhibit-icon">⏳</div>
          <h2 className="exhibit-name">The Timeline</h2>
          <p className="exhibit-desc">
            Walk through the ages. See where each piece
            fits in the grand sweep of history.
          </p>
          <span className="exhibit-enter">Enter →</span>
        </div>

        <div className="exhibit-card" onClick={() => onEnter('collections')} style={{ animationDelay: '0.24s' }}>
          <div className="exhibit-icon">🗂</div>
          <h2 className="exhibit-name">Collections</h2>
          <p className="exhibit-desc">
            Themed exhibits grouping related articles.
            Empires, battles, trade, ideas.
          </p>
          <span className="exhibit-enter">Enter →</span>
        </div>
      </div>

      <footer className={`lobby-footer ${phase >= 3 ? 'visible' : ''}`}>
        <p>A place for thoughts on the human story</p>
      </footer>
    </div>
  );
}

export default Lobby;
