import { useRef } from 'react';
import { useTilt } from '../hooks/useScrollEffects.js';
import './Collections.css';

function buildCollections(books, lang) {
  const shelfMap = {};

  for (const book of books) {
    const shelf = lang === 'zh' ? book.shelfZh || book.shelf : book.shelf;
    if (!shelfMap[shelf]) shelfMap[shelf] = [];
    shelfMap[shelf].push(book);
  }

  return Object.entries(shelfMap)
    .map(([shelf, entries]) => ({
      tag: shelf.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'),
      title: shelf,
      books: entries,
      themes: [
        ...new Set(
          entries.flatMap((entry) =>
            lang === 'zh' ? entry.themesZh || entry.themes || [] : entry.themes || []
          )
        ),
      ].slice(0, 4),
    }))
    .sort((a, b) => b.books.length - a.books.length);
}

const COLLECTION_ICONS = {
  '俄罗斯经典': '俄',
  '拉美文学': '拉',
  '科幻': '幻',
  'russian-classics': 'RC',
  'latin-american-fiction': 'LA',
  'science-fiction': 'SF',
  default: 'BK',
};

const text = {
  zh: {
    title: '分类',
    desc: '按类型整理读过的书',
    empty: '给每本书加上 `shelf` 或 `shelfZh` 字段后，这里会自动生成。',
    bookCount: (count) => `${count} 本书`,
    themes: '主题',
  },
  en: {
    title: 'Shelves',
    desc: 'Books grouped by shelf',
    empty: 'Add a `shelf` field to each book to build this room automatically.',
    bookCount: (count) => `${count} book${count > 1 ? 's' : ''}`,
    themes: 'Themes',
  },
};

function CollCard({ coll, lang, t }) {
  const ref = useRef(null);
  useTilt(ref, { maxDeg: 4 });
  const icon = COLLECTION_ICONS[coll.tag] || COLLECTION_ICONS.default;

  return (
    <div ref={ref} className="coll-card">
      <div className="coll-icon">{icon}</div>
      <h2 className="coll-name">{coll.title}</h2>
      <span className="coll-count">{t.bookCount(coll.books.length)}</span>
      <ul className="coll-list">
        {coll.books.map((book) => (
          <li key={book.slug} className="coll-item">
            {book.featured && <span className="coll-star">*</span>}
            {lang === 'zh' ? book.titleZh || book.title : book.title}
          </li>
        ))}
      </ul>
      {coll.themes.length > 0 && <p className="coll-themes">{t.themes}: {coll.themes.join(' / ')}</p>}
    </div>
  );
}

function Collections({ books, lang }) {
  const t = text[lang];
  const collections = buildCollections(books, lang);

  return (
    <div className="collections-room">
      <div className="coll-header">
        <h1 className="coll-title">{t.title}</h1>
        <p className="coll-desc">{t.desc}</p>
        <div className="coll-rule" />
      </div>

      {collections.length === 0 ? (
        <p className="coll-empty">{t.empty}</p>
      ) : (
        <div className="coll-grid">
          {collections.map((coll) => (
            <CollCard key={coll.tag} coll={coll} lang={lang} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Collections;
