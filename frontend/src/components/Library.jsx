import { useState, useEffect, useRef } from 'react';
import { useTilt } from '../hooks/useScrollEffects.js';
import './Library.css';

const text = {
  zh: {
    featured: '重点条目',
    published: '出版于',
    anchor: '这本书是整个馆藏里的核心作品',
    visualNote: '视觉读书卡片',
    whyMatters: '为什么值得留下',
    whatStayed: '真正留在脑中的部分',
    mapTitle: '人物关系图',
    mapDesc: '这就是新形式的核心。每本书只保留一张关系图和几条记忆锚点，不再逼自己写成长文。',
    quickNotes: '快速笔记',
    themes: '主题',
    previous: '上一本',
    next: '下一本',
    back: '回到书架',
    shelfIntro: '把读过的书整理成视觉档案',
    shelfDesc: '点开任意一本，就能看到简短总结、记忆锚点和可以继续补充的人物关系图。',
    noMap: '这本书还没有关系图。',
    series: '系列合集',
    seriesDesc: '这一套书已合并展示，可以先看整套，再进入单本。',
    openSeries: '进入合集',
    volumeCount: (count) => `${count} 册`,
    seriesView: '系列总览',
    seriesIntro: '同一系列的书合并展示，先保留整体脉络，再进入单本细看。',
    volumes: '卷册',
    openVolume: '查看单本',
  },
  en: {
    featured: 'Featured entry',
    published: 'Published',
    anchor: 'Anchor book in the collection',
    visualNote: 'Visual reading note',
    whyMatters: 'Why this book matters',
    whatStayed: 'What stayed with you',
    mapTitle: 'Character relationship map',
    mapDesc: 'This is the heart of the new format: one visual web per book, plus a few memory anchors instead of a long essay.',
    quickNotes: 'Quick notes',
    themes: 'Themes',
    previous: 'Previous book',
    next: 'Next book',
    back: 'Back to shelf',
    shelfIntro: 'A visual archive of books you have read',
    shelfDesc: 'Open any entry to see the emotional summary, a few memory anchors, and a relationship map you can keep expanding.',
    noMap: 'No relationship map yet for this book.',
    series: 'Series bundle',
    seriesDesc: 'This set is bundled together so you can enter the series first, then open individual volumes.',
    openSeries: 'Open bundle',
    volumeCount: (count) => `${count} volumes`,
    seriesView: 'Series overview',
    seriesIntro: 'Books from the same series are bundled together so the shelf stays cleaner.',
    volumes: 'Volumes',
    openVolume: 'Open volume',
  },
};

function pick(lang, zhValue, enValue) {
  return lang === 'zh' ? zhValue || enValue : enValue;
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const pct = (root.scrollTop / (root.scrollHeight - root.clientHeight)) * 100;
      setProgress(Math.min(100, pct || 0));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}

function buildShelfItems(books) {
  const grouped = new Map();
  const items = [];

  for (const book of books) {
    if (!book.series) {
      items.push({ type: 'book', book });
      continue;
    }

    if (!grouped.has(book.series)) {
      grouped.set(book.series, []);
      items.push({ type: 'series', key: book.series });
    }

    grouped.get(book.series).push(book);
  }

  return items.map((item) => {
    if (item.type === 'book') return item;

    const volumes = grouped
      .get(item.key)
      .slice()
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

    return {
      type: 'series',
      series: {
        key: item.key,
        title: volumes[0].seriesTitle,
        titleZh: volumes[0].seriesTitleZh,
        author: volumes[0].author,
        authorZh: volumes[0].authorZh,
        shelf: volumes[0].shelf,
        shelfZh: volumes[0].shelfZh,
        featured: volumes.some((volume) => volume.featured),
        coverTone: volumes[0].coverTone,
        volumes,
      },
    };
  });
}

function ShelfBook({ book, index, onSelect, lang, t }) {
  const ref = useRef(null);
  useTilt(ref, { maxDeg: 3 });

  return (
    <button
      ref={ref}
      type="button"
      className={`shelf-book ${book.featured ? 'featured' : ''}`}
      onClick={onSelect}
      style={{ animationDelay: `${index * 0.07}s`, '--cover-tone': book.coverTone || '#6b5638' }}
    >
      <div className="book-spine" />
      <div className="book-content">
        {book.featured && <div className="book-badge">{t.featured}</div>}
        <div className="book-kicker">{pick(lang, book.authorZh, book.author)}</div>
        <h3 className="book-title">{pick(lang, book.titleZh, book.title)}</h3>
        <p className="book-excerpt">{pick(lang, book.excerptZh, book.excerpt)}</p>
        <div className="book-meta">
          <span>{pick(lang, book.shelfZh, book.shelf)}</span>
        </div>
      </div>
    </button>
  );
}

function SeriesBundle({ series, index, onSelect, lang, t }) {
  const ref = useRef(null);
  useTilt(ref, { maxDeg: 3 });

  return (
    <button
      ref={ref}
      type="button"
      className={`shelf-book series-bundle ${series.featured ? 'featured' : ''}`}
      onClick={onSelect}
      style={{ animationDelay: `${index * 0.07}s`, '--cover-tone': series.coverTone || '#5d6376' }}
    >
      <div className="book-spine" />
      <div className="book-content">
        <div className="bundle-topline">
          <span className="book-badge">{t.series}</span>
          <span className="bundle-count">{t.volumeCount(series.volumes.length)}</span>
        </div>
        <div className="book-kicker">{pick(lang, series.authorZh, series.author)}</div>
        <h3 className="book-title">{pick(lang, series.titleZh, series.title)}</h3>
        <p className="book-excerpt">{t.seriesDesc}</p>
        <div className="bundle-volumes">
          {series.volumes.slice(0, 4).map((volume) => (
            <span key={volume.slug} className="bundle-chip">
              {pick(lang, volume.titleZh, volume.title)}
            </span>
          ))}
        </div>
        <div className="book-meta">
          <span>{pick(lang, series.shelfZh, series.shelf)}</span>
          <span>{t.openSeries}</span>
        </div>
      </div>
    </button>
  );
}

function RelationshipMap({ map, lang, t }) {
  if (!map?.nodes?.length) {
    return <p className="map-empty">{t.noMap}</p>;
  }

  const lookup = Object.fromEntries(map.nodes.map((node) => [node.id, node]));

  return (
    <div className="relationship-map">
      <svg viewBox="0 0 100 100" className="relationship-svg" aria-label={t.mapTitle}>
        {map.edges.map((edge) => {
          const from = lookup[edge.from];
          const to = lookup[edge.to];
          if (!from || !to) return null;

          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={`${edge.from}-${edge.to}-${edge.label}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={`map-edge ${edge.tone || 'muted'}`}
              />
              <text x={midX} y={midY} className="map-edge-label">
                {pick(lang, edge.labelZh, edge.label)}
              </text>
            </g>
          );
        })}

        {map.nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size === 'lg' ? 5.5 : node.size === 'md' ? 4.5 : 3.5}
              className={`map-node ${node.role || 'default'}`}
            />
            <text x={node.x} y={node.y - 7} textAnchor="middle" className="map-node-label">
              {pick(lang, node.labelZh, node.label)}
            </text>
            <text x={node.x} y={node.y + 10} textAnchor="middle" className="map-node-role">
              {pick(lang, node.roleZh, node.role)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Library({ books, lang }) {
  const [selected, setSelected] = useState(null);
  const t = text[lang];
  const shelfItems = buildShelfItems(books);

  if (selected?.type === 'series') {
    const series = selected.series;

    return (
      <div className="library-reader">
        <ReadingProgress />
        <div className="reading-lamp" />

        <div className="book-page">
          <button type="button" className="lib-back" onClick={() => setSelected(null)}>
            {t.back}
          </button>

          <header className="lib-header">
            <span className="lib-chapter">{t.seriesView}</span>
            <h1 className="lib-title">{pick(lang, series.titleZh, series.title)}</h1>
            <div className="lib-meta">
              <span className="lib-era">{pick(lang, series.authorZh, series.author)}</span>
              <span>{pick(lang, series.shelfZh, series.shelf)}</span>
              <span>{t.volumeCount(series.volumes.length)}</span>
            </div>
            <div className="lib-featured">{t.seriesIntro}</div>
            <div className="lib-rule" />
          </header>

          <section className="lib-section">
            <div>
              <h2>{t.volumes}</h2>
              <p>{t.seriesDesc}</p>
            </div>
            <div className="series-list">
              {series.volumes.map((volume) => (
                <button
                  key={volume.slug}
                  type="button"
                  className="series-volume"
                  onClick={() => {
                    setSelected({ type: 'book', book: volume });
                    window.scrollTo({ top: 0 });
                  }}
                >
                  <span className="series-volume-index">{volume.seriesOrder}</span>
                  <span className="series-volume-title">{pick(lang, volume.titleZh, volume.title)}</span>
                  <span className="series-volume-action">{t.openVolume}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (selected?.type === 'book') {
    const book = selected.book;
    const flatBooks = books;
    const bookIndex = flatBooks.findIndex((entry) => entry.slug === book.slug);

    return (
      <div className="library-reader">
        <ReadingProgress />
        <div className="reading-lamp" />

        <div className="book-page">
          <button type="button" className="lib-back" onClick={() => setSelected(null)}>
            {t.back}
          </button>

          <header className="lib-header">
            <span className="lib-chapter">{pick(lang, book.shelfZh, book.shelf)}</span>
            <h1 className="lib-title">{pick(lang, book.titleZh, book.title)}</h1>
            <div className="lib-meta">
              <span className="lib-era">{pick(lang, book.authorZh, book.author)}</span>
              <span>{t.published} {book.publishedYear}</span>
            </div>
            <div className="lib-featured">{book.featured ? t.anchor : t.visualNote}</div>
            <div className="lib-rule" />
          </header>

          <section className="lib-section">
            <div>
              <h2>{t.whyMatters}</h2>
              <p>{pick(lang, book.summaryZh, book.summary)}</p>
            </div>
            <div>
              <h2>{t.whatStayed}</h2>
              <p>{pick(lang, book.whyItStayedZh, book.whyItStayed)}</p>
            </div>
          </section>

          <section className="lib-section map-section">
            <div className="map-copy">
              <h2>{t.mapTitle}</h2>
              <p>{t.mapDesc}</p>
            </div>
            <RelationshipMap map={book.relationshipMap} lang={lang} t={t} />
          </section>

          <section className="lib-section notes-section">
            <div>
              <h2>{t.quickNotes}</h2>
              <ul className="lib-notes">
                {(lang === 'zh' ? book.notesZh || book.notes : book.notes || []).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{t.themes}</h2>
              <div className="lib-tags">
                {(lang === 'zh' ? book.themesZh || book.themes : book.themes || []).map((theme) => (
                  <span key={theme} className="lib-tag">{theme}</span>
                ))}
              </div>
            </div>
          </section>

          <footer className="lib-footer">
            <div className="lib-nav-btns">
              {bookIndex > 0 && (
                <button
                  type="button"
                  className="lib-nav-btn"
                  onClick={() => {
                    setSelected({ type: 'book', book: flatBooks[bookIndex - 1] });
                    window.scrollTo({ top: 0 });
                  }}
                >
                  {t.previous}
                </button>
              )}
              {bookIndex < flatBooks.length - 1 && (
                <button
                  type="button"
                  className="lib-nav-btn"
                  onClick={() => {
                    setSelected({ type: 'book', book: flatBooks[bookIndex + 1] });
                    window.scrollTo({ top: 0 });
                  }}
                >
                  {t.next}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="library-shelf">
      <div className="shelf-header">
        <h1 className="shelf-title">{lang === 'zh' ? '藏书' : 'Library'}</h1>
        <p className="shelf-desc">{t.shelfIntro}</p>
        <div className="shelf-rule" />
      </div>

      <div className="shelf-intro">
        <p>{t.shelfDesc}</p>
      </div>

      <div className="shelf-stage">
        <div className="shelf-aura" aria-hidden="true" />
        <div className="shelf-plaque">
          <span className="shelf-plaque-label">{lang === 'zh' ? '木架陈列' : 'Shelf Display'}</span>
          <div className="shelf-plaque-rule" />
        </div>

        <div className="shelf-grid">
          {shelfItems.map((item, index) =>
            item.type === 'series' ? (
              <SeriesBundle
                key={item.series.key}
                series={item.series}
                index={index}
                onSelect={() => {
                  setSelected({ type: 'series', series: item.series });
                  window.scrollTo({ top: 0 });
                }}
                lang={lang}
                t={t}
              />
            ) : (
              <ShelfBook
                key={item.book.slug}
                book={item.book}
                index={index}
                onSelect={() => {
                  setSelected({ type: 'book', book: item.book });
                  window.scrollTo({ top: 0 });
                }}
                lang={lang}
                t={t}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Library;
