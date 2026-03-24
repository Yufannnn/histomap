import './TableOfContents.css';

function TableOfContents({ articles, onSelect, onBack }) {
  return (
    <div className="toc">
      <h2 className="toc-heading">Contents</h2>
      <div className="toc-rule" />

      <ol className="toc-list">
        {articles.map((article, i) => (
          <li
            key={article.slug}
            className={`toc-item ${article.featured ? 'featured' : ''}`}
            onClick={() => onSelect(i)}
          >
            <span className="toc-num">{toRoman(i + 1)}</span>
            <div className="toc-info">
              <span className="toc-title">
                {article.title}
                {article.featured && <span className="toc-star"> ✦</span>}
              </span>
              <span className="toc-meta">
                {article.era && <>{article.era} · </>}
                {article.readingTime}
              </span>
            </div>
            <span className="toc-dots" />
            <span className="toc-page">{i + 3}</span>
          </li>
        ))}
      </ol>

      <button className="toc-back" onClick={onBack}>← Back to cover</button>
    </div>
  );
}

function toRoman(num) {
  const vals = [10, 9, 5, 4, 1];
  const syms = ['X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i];
      num -= vals[i];
    }
  }
  return result;
}

export default TableOfContents;
