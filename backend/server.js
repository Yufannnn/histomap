const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Load all GeoJSON and narrative files into memory at startup
const bordersCache = {};
const narrativesCache = {};

const ERAS = [
  { year: 1,    yearKey: '0001', label: '1 AD',    subtitle: 'Roman Empire Era' },
  { year: 500,  yearKey: '0500', label: '500 AD',  subtitle: 'Fall of Rome' },
  { year: 1000, yearKey: '1000', label: '1000 AD', subtitle: 'Medieval World' },
  { year: 1500, yearKey: '1500', label: '1500 AD', subtitle: 'Age of Exploration' },
  { year: 1800, yearKey: '1800', label: '1800 AD', subtitle: 'Revolutionary Era' },
  { year: 1914, yearKey: '1914', label: '1914',    subtitle: 'WWI Eve' },
  { year: 1945, yearKey: '1945', label: '1945',    subtitle: 'End of WWII' },
];

for (const era of ERAS) {
  const bordersPath = path.join(__dirname, 'data', 'borders', `${era.yearKey}.geojson`);
  const narrativesPath = path.join(__dirname, 'data', 'narratives', `${era.yearKey}.json`);

  if (fs.existsSync(bordersPath)) {
    try {
      bordersCache[era.yearKey] = JSON.parse(fs.readFileSync(bordersPath, 'utf8'));
    } catch (e) {
      console.warn(`Failed to load borders for ${era.yearKey}:`, e.message);
    }
  } else {
    console.warn(`Missing borders file: ${bordersPath}`);
  }

  if (fs.existsSync(narrativesPath)) {
    try {
      narrativesCache[era.yearKey] = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
    } catch (e) {
      console.warn(`Failed to load narratives for ${era.yearKey}:`, e.message);
    }
  } else {
    console.warn(`Missing narratives file: ${narrativesPath}`);
  }
}

// Build featured regions index from narratives with "featured": true
const featuredCache = {};
for (const era of ERAS) {
  const narratives = narrativesCache[era.yearKey] || {};
  featuredCache[era.yearKey] = Object.keys(narratives).filter(
    (rid) => narratives[rid].featured
  );
}

// Inject "featured" flag into border features so frontend can style them
for (const era of ERAS) {
  const borders = bordersCache[era.yearKey];
  const featured = featuredCache[era.yearKey] || [];
  if (borders && featured.length > 0) {
    for (const feat of borders.features) {
      const rid = feat.properties.region_id;
      if (rid && featured.includes(rid)) {
        feat.properties.featured = true;
      }
    }
  }
}

// Expose cache and ERAS to routes
app.locals.bordersCache = bordersCache;
app.locals.narrativesCache = narrativesCache;
app.locals.featuredCache = featuredCache;
app.locals.ERAS = ERAS;

app.use('/api/eras', require('./routes/eras'));
app.use('/api/borders', require('./routes/borders'));
app.use('/api/narratives', require('./routes/narratives'));
app.use('/api/search', require('./routes/search'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/books', require('./routes/books'));

app.listen(PORT, () => {
  console.log(`Histomap backend running on http://localhost:${PORT}`);
  console.log(`Loaded eras: ${Object.keys(bordersCache).join(', ')}`);
});
