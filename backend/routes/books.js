const express = require('express');
const router = express.Router();
const books = require('../data/books');

function formatBook(book) {
  return {
    ...book,
    readingTime: 'visual entry',
  };
}

router.get('/', (req, res) => {
  res.json(books.map(formatBook));
});

router.get('/:slug', (req, res) => {
  const book = books.find((entry) => entry.slug === req.params.slug);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(formatBook(book));
});

module.exports = router;
