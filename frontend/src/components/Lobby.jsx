import { useEffect, useState, useRef } from 'react';
import { useTilt } from '../hooks/useScrollEffects.js';
import './Lobby.css';

function ExhibitCard({ room, onEnter, delay }) {
  const ref = useRef(null);
  useTilt(ref, { maxDeg: 4 });

  return (
    <div
      ref={ref}
      className="exhibit-card"
      onClick={() => onEnter(room.id)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="exhibit-icon">{room.icon}</div>
      <h2 className="exhibit-name">{room.name}</h2>
      <p className="exhibit-desc">{room.desc}</p>
      <span className="exhibit-enter">Enter →</span>
    </div>
  );
}

const EXHIBITS = [
  { id: 'library', icon: '📖', name: 'The Library', desc: 'Essays & deep dives on history. Browse the collection, read at your pace.' },
  { id: 'timeline', icon: '⏳', name: 'The Timeline', desc: 'Walk through the ages. See where each piece fits in the grand sweep of history.' },
  { id: 'collections', icon: '🗂', name: 'Collections', desc: 'Themed exhibits grouping related articles. Empires, battles, trade, ideas.' },
];

function Lobby({ onEnter, articleCount }) {
  const [phase, setPhase] = useState(0);

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
        {EXHIBITS.map((exhibit, i) => (
          <ExhibitCard
            key={exhibit.id}
            room={{ ...exhibit, desc: i === 0 ? `${articleCount} essays & deep dives on history. Browse the collection, read at your pace.` : exhibit.desc }}
            onEnter={onEnter}
            delay={i * 0.12}
          />
        ))}
      </div>

      <footer className={`lobby-footer ${phase >= 3 ? 'visible' : ''}`}>
        <p>A place for thoughts on the human story</p>
      </footer>
    </div>
  );
}

export default Lobby;
