import './BookCover.css';

function BookCover({ onOpen }) {
  return (
    <div className="cover">
      <div className="cover-ornament top">✦ ✦ ✦</div>

      <div className="cover-content">
        <h1 className="cover-title">HISTOMAP</h1>
        <div className="cover-rule" />
        <p className="cover-subtitle">Thoughts on History</p>
        <p className="cover-subtitle small">Essays, Hot Takes & Deep Dives</p>
      </div>

      <div className="cover-author">
        <div className="cover-rule short" />
        <p className="author-by">by</p>
        <p className="author-name">Henry Zhu Yufan</p>
      </div>

      <button className="cover-open" onClick={onOpen}>
        Open Book →
      </button>

      <div className="cover-ornament bottom">✦ ✦ ✦</div>
    </div>
  );
}

export default BookCover;
