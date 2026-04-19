const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const WRITINGS_DIR = path.join(__dirname, '..', '..', 'writings');

const WRITINGS_INDEX = [
  {
    slug: 'life-is-just-a-joke',
    title: 'Life is Just a Joke? — The Dark Humor of Bohemia',
    subtitle: 'Czech culture, gallows humor, and the philosophical roots of Bohemian absurdism',
    date: '2025',
    tags: ['Bohemia', 'Czech', 'CK3', 'Philosophy', 'Kafka'],
  },
  {
    slug: 'assimilations-and-exception',
    title: 'The Last Riders from the Steppe',
    subtitle: 'Annihilation, assimilation, and the Magyar exception',
    date: '2025',
    tags: ['Hungary', 'Magyars', 'Bulgars', 'Pechenegs', 'CK3', 'Steppe'],
  },
];

// GET /api/writings — list all writings
router.get('/', (req, res) => {
  res.json(WRITINGS_INDEX);
});

// GET /api/writings/:slug — get markdown content
router.get('/:slug', (req, res) => {
  const entry = WRITINGS_INDEX.find((w) => w.slug === req.params.slug);
  if (!entry) {
    return res.status(404).json({ error: 'Writing not found' });
  }

  const mdPath = path.join(WRITINGS_DIR, `${entry.slug}.md`);
  if (!fs.existsSync(mdPath)) {
    return res.status(404).json({ error: 'Markdown file not found' });
  }

  const content = fs.readFileSync(mdPath, 'utf8');
  res.json({ ...entry, content });
});

module.exports = router;
