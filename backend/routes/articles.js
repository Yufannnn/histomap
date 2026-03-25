const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ARTICLES_DIR = path.join(__dirname, '..', 'data', 'articles');

function parseFrontmatter(content) {
  // Normalize line endings to \n for consistent parsing
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: normalized };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      // Parse arrays like [tag1, tag2]
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map((s) => s.trim());
      }
      // Parse booleans
      if (val === 'true') val = true;
      if (val === 'false') val = false;
      meta[kv[1]] = val;
    }
  }
  return { meta, body: match[2].trim() };
}

function loadArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const content = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf8');
      const { meta, body } = parseFrontmatter(content);
      const slug = filename.replace('.md', '');
      return {
        slug,
        title: meta.title || slug,
        date: meta.date || null,
        tags: meta.tags || [],
        era: meta.era || null,
        featured: meta.featured || false,
        excerpt: meta.excerpt || body.slice(0, 160) + '...',
        body,
        readingTime: Math.ceil(body.split(/\s+/).length / 200) + ' min read',
      };
    })
    .sort((a, b) => {
      // Featured first, then by date descending
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.date || '').localeCompare(a.date || '');
    });
}

// GET /api/articles — list all articles
router.get('/', (req, res) => {
  const articles = loadArticles();
  const tag = req.query.tag;
  if (tag) {
    return res.json(articles.filter((a) => a.tags.includes(tag)));
  }
  res.json(articles);
});

// GET /api/articles/:slug — single article
router.get('/:slug', (req, res) => {
  const articles = loadArticles();
  const article = articles.find((a) => a.slug === req.params.slug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
});

module.exports = router;
