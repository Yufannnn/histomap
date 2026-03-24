import { useState, useEffect } from 'react';
import BookCover from './components/BookCover.jsx';
import TableOfContents from './components/TableOfContents.jsx';
import ChapterView from './components/ChapterView.jsx';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState('cover'); // 'cover' | 'toc' | index number
  const [direction, setDirection] = useState('forward');

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {});
  }, []);

  function goTo(target) {
    const currentIdx = typeof page === 'number' ? page : -1;
    const targetIdx = typeof target === 'number' ? target : -1;
    setDirection(targetIdx > currentIdx ? 'forward' : 'back');
    setPage(target);
    window.scrollTo({ top: 0 });
  }

  function goNext() {
    if (page === 'cover') goTo('toc');
    else if (page === 'toc') goTo(0);
    else if (typeof page === 'number' && page < articles.length - 1) goTo(page + 1);
  }

  function goPrev() {
    if (page === 'toc') goTo('cover');
    else if (typeof page === 'number' && page === 0) goTo('toc');
    else if (typeof page === 'number' && page > 0) goTo(page - 1);
  }

  const totalPages = articles.length + 2; // cover + toc + chapters
  const currentPage = page === 'cover' ? 1 : page === 'toc' ? 2 : page + 3;

  return (
    <div className="book-shell">
      <div className={`page-container anim-${direction}`} key={page}>
        {page === 'cover' && (
          <BookCover onOpen={() => goTo('toc')} />
        )}

        {page === 'toc' && (
          <TableOfContents
            articles={articles}
            onSelect={(i) => goTo(i)}
            onBack={() => goTo('cover')}
          />
        )}

        {typeof page === 'number' && articles[page] && (
          <ChapterView
            article={articles[page]}
            chapterNum={page + 1}
            totalChapters={articles.length}
            onGoToToc={() => goTo('toc')}
          />
        )}
      </div>

      {/* Page navigation */}
      <nav className="book-nav">
        <button
          className="nav-btn prev"
          onClick={goPrev}
          disabled={page === 'cover'}
        >
          ←
        </button>
        <span className="nav-page">{currentPage} / {totalPages}</span>
        <button
          className="nav-btn next"
          onClick={goNext}
          disabled={typeof page === 'number' && page >= articles.length - 1}
        >
          →
        </button>
      </nav>
    </div>
  );
}

export default App;
