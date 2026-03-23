const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query || query.length < 2) {
    return res.json([]);
  }

  const { bordersCache, narrativesCache, ERAS } = req.app.locals;
  const results = [];
  const seen = new Set();

  for (const era of ERAS) {
    const borders = bordersCache[era.yearKey];
    const narratives = narrativesCache[era.yearKey] || {};
    if (!borders) continue;

    for (const feat of borders.features) {
      const props = feat.properties;
      const name = props.NAME || props.name || '';
      if (!name) continue;

      const nameLower = name.toLowerCase();
      const regionId = props.region_id;
      const narrative = regionId ? narratives[regionId] : null;

      // Search in name, ruler, capital, summary, key_events
      let matched = nameLower.includes(query);
      let matchField = matched ? 'name' : null;

      if (!matched && narrative) {
        if (narrative.ruler && narrative.ruler.toLowerCase().includes(query)) {
          matched = true;
          matchField = 'ruler';
        } else if (narrative.capital && narrative.capital.toLowerCase().includes(query)) {
          matched = true;
          matchField = 'capital';
        } else if (narrative.summary && narrative.summary.toLowerCase().includes(query)) {
          matched = true;
          matchField = 'summary';
        } else if (narrative.key_events) {
          for (const evt of narrative.key_events) {
            if (evt.toLowerCase().includes(query)) {
              matched = true;
              matchField = 'event';
              break;
            }
          }
        }
      }

      if (matched) {
        const key = `${era.yearKey}:${regionId || name}`;
        if (seen.has(key)) continue;
        seen.add(key);

        results.push({
          name,
          regionId,
          era: era.label,
          yearKey: era.yearKey,
          subtitle: era.subtitle,
          matchField,
          culture: props.culture_group,
          hasNarrative: !!narrative,
          featured: !!(narrative && narrative.featured),
        });
      }
    }
  }

  // Sort: name matches first, then by era
  results.sort((a, b) => {
    if (a.matchField === 'name' && b.matchField !== 'name') return -1;
    if (b.matchField === 'name' && a.matchField !== 'name') return 1;
    return parseInt(a.yearKey) - parseInt(b.yearKey);
  });

  res.json(results.slice(0, 30));
});

module.exports = router;
