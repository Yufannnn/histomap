import { useEffect, useState, useRef } from 'react';
import { useTilt } from '../hooks/useScrollEffects.js';
import './Lobby.css';

const EXHIBITS = {
  zh: [
    { id: 'library', icon: '书', name: '藏书', desc: '把读过的书做成视觉档案，每一本都配一张可以继续扩展的人物关系图。' },
    { id: 'collections', icon: '类', name: '分类', desc: '按类型和主题整理，而不是继续消耗精力写长文章。' },
  ],
  en: [
    { id: 'library', icon: 'LIB', name: 'Library', desc: 'A visual archive of finished books, each one centered on a relationship map you can keep growing.' },
    { id: 'collections', icon: 'TAG', name: 'Shelves', desc: 'Organized by genre and theme, without the pressure of writing long essays.' },
  ],
};

const text = {
  zh: {
    subtitle: '把读过的书整理成可回看的视觉档案',
    curator: 'Henry Zhu Yufan 的阅读收藏',
    footer: '把真正留下印象的书，整理成可以慢慢补完的图谱',
    enter: '进入',
    libraryCount: (count) => `目前已整理 ${count} 本书。点开任意一本，就能看到人物关系、核心张力和几条简短笔记。`,
  },
  en: {
    subtitle: 'A personal reading museum',
    curator: 'Curated reading archive by Henry Zhu Yufan',
    footer: 'A place for the books that kept leaving marks',
    enter: 'Enter',
    libraryCount: (count) => `${count} books archived so far. Open any one to see the character web, the central tension, and a few memory anchors.`,
  },
};

function ExhibitCard({ room, onEnter, delay, enterLabel }) {
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
      <span className="exhibit-enter">{enterLabel}</span>
    </div>
  );
}

function Lobby({ onEnter, bookCount, lang, brand }) {
  const [phase, setPhase] = useState(0);
  const exhibitList = EXHIBITS[lang];
  const t = text[lang];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="lobby">
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
        <div className={`lobby-ornament ${phase >= 1 ? 'visible' : ''}`}>* * *</div>
        <h1 className={`lobby-title ${phase >= 1 ? 'visible' : ''}`}>{brand}</h1>
        <p className={`lobby-subtitle ${phase >= 2 ? 'visible' : ''}`}>{t.subtitle}</p>
        <div className={`lobby-rule ${phase >= 2 ? 'visible' : ''}`} />
        <p className={`lobby-curator ${phase >= 2 ? 'visible' : ''}`}>{t.curator}</p>
      </header>

      <div className="lobby-count">{t.libraryCount(bookCount)}</div>

      <div className={`lobby-exhibits ${phase >= 3 ? 'visible' : ''}`}>
        {exhibitList.map((exhibit, i) => (
          <ExhibitCard
            key={exhibit.id}
            room={exhibit}
            onEnter={onEnter}
            delay={i * 0.12}
            enterLabel={t.enter}
          />
        ))}
      </div>

      <footer className={`lobby-footer ${phase >= 3 ? 'visible' : ''}`}>
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default Lobby;
