const express = require('express');
const router = express.Router();

const YEAR_TO_KEY = {
  '1': '0001', '0001': '0001',
  '500': '0500', '0500': '0500',
  '1000': '1000',
  '1500': '1500',
  '1800': '1800',
  '1914': '1914',
  '1945': '1945',
};

router.get('/:year', (req, res) => {
  const yearKey = YEAR_TO_KEY[req.params.year];
  if (!yearKey) {
    return res.status(404).json({ error: 'Era not found', year: req.params.year });
  }

  const data = req.app.locals.bordersCache[yearKey];
  if (!data) {
    return res.status(404).json({ error: 'Border data not available', year: req.params.year });
  }

  res.json(data);
});

module.exports = router;
