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

router.get('/:year/:regionId', (req, res) => {
  const yearKey = YEAR_TO_KEY[req.params.year];
  if (!yearKey) {
    return res.status(404).json({ error: 'Era not found', year: req.params.year });
  }

  const eraData = req.app.locals.narrativesCache[yearKey];
  if (!eraData) {
    return res.status(404).json({ error: 'Narrative data not available', year: req.params.year });
  }

  const narrative = eraData[req.params.regionId];
  if (!narrative) {
    return res.status(404).json({
      error: 'Region not found',
      regionId: req.params.regionId,
      year: req.params.year,
    });
  }

  res.json(narrative);
});

module.exports = router;
