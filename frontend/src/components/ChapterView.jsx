import ReactMarkdown from 'react-markdown';
import './ChapterView.css';

function toRoman(num) {
  const vals = [10, 9, 5, 4, 1];
  const syms = ['X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
  }
  return result;
}

function ChapterView({ article, chapterNum, totalChapters, onGoToToc }) {
  return (
    <div className="chapter">
      {/* Chapter header */}
      <header className="chapter-header">
        <span className="chapter-label">Chapter {toRoman(chapterNum)}</span>
        <h1 className="chapter-title">{article.title}</h1>

        <div className="chapter-meta">
          {article.era && <span className="chapter-era">{article.era}</span>}
          {article.date && <span>{article.date}</span>}
          <span>{article.readingTime}</span>
        </div>

        {article.featured && (
          <div className="chapter-featured">
            ✦ Author's Note — Written by Henry Zhu Yufan
          </div>
        )}

        <div className="chapter-rule" />
      </header>

      {/* Drop cap first paragraph handled by CSS */}
      <div className="chapter-body">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>

      {/* Chapter footer */}
      <footer className="chapter-footer">
        {article.tags.length > 0 && (
          <div className="chapter-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="chapter-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="chapter-end">— {chapterNum} of {totalChapters} —</div>

        <button className="chapter-toc-link" onClick={onGoToToc}>
          Return to Contents
        </button>
      </footer>
    </div>
  );
}

export default ChapterView;
