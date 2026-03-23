# Histomap

An interactive historical world map — explore the borders, empires, and civilizations that shaped our world across thousands of years of history.

Pick an era. Watch the map transform. Click a region. Discover what happened there.

![histomap preview](docs/preview.png)

---

## Features

- World map with historical border overlays across 7+ era snapshots
- Clickable era timeline — jump between 1 AD, 500, 1000, 1500, 1800, 1914, 1945 (WWII end)
- Region info panel — click any territory to read what was happening there
- Clean, minimal UI that keeps the map front and center

**Planned:**
- Continuous year-by-year timeline scrubber (up to 1945)
- Animated transitions between eras
- AI-generated narratives for regions
- Search by civilization, ruler, or event

> **Scope note:** Coverage ends at 1945. Post-WWII borders involve sensitive ongoing territorial disputes and are intentionally out of scope.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Map | Leaflet.js (via react-leaflet) |
| Backend | Node.js + Express |
| Data | Static GeoJSON + JSON narratives |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all

# Start dev servers (frontend + backend concurrently)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/eras` | List all available era snapshots |
| `GET /api/borders/:year` | GeoJSON borders for a given year |
| `GET /api/narratives/:year/:regionId` | Narrative text for a region in a given era |

---

## Data Sources

Historical border data sourced from the [historical-country-borders-3857](https://github.com/aourednik/historical-country-borders-3857) open dataset, curated and adapted for this project.

---

## Project Structure

```
histomap/
├── frontend/               # React app (Vite)
│   └── src/
│       ├── components/
│       │   ├── Map.jsx         # Leaflet map + GeoJSON overlay
│       │   ├── Timeline.jsx    # Era selector bar
│       │   └── InfoPanel.jsx   # Region detail slide-in panel
│       └── App.jsx
├── backend/                # Express API
│   ├── data/
│   │   ├── borders/        # GeoJSON per era (e.g. 0100.geojson)
│   │   └── narratives/     # Narrative JSON per era
│   ├── routes/
│   └── server.js
└── package.json            # Root scripts
```

---

## Roadmap

- [x] Project setup & documentation
- [ ] Backend API with GeoJSON data for 7 eras
- [ ] React frontend with Leaflet map
- [ ] Era timeline selector
- [ ] Region info panel
- [ ] Timeline scrubber (continuous years)
- [ ] Animated era transitions
- [ ] AI-generated narratives
- [ ] Search functionality

---

## Authors

- Zhu Yufan

## License

MIT
