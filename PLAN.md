# Histomap — Build Plan

## Vision

A web app where anyone can explore human history through an interactive world map. The full vision spans all of recorded history (from ~3000 BC to present) with every major civilization, empire, and border change visualized. We build toward that vision step by step.

---

## Phase 1 — MVP (current)

**Goal:** A working, shareable app with 7 era snapshots.

### Era Snapshots

| Year | Label | Key Civilizations |
|------|-------|------------------|
| 1 AD | Roman Empire Era | Rome, Han China, Parthia, Maurya |
| 500 AD | Fall of Rome | Byzantine, Gupta, Sassanid |
| 1000 AD | Medieval World | Song China, Islamic Caliphates, Holy Roman Empire |
| 1500 AD | Age of Exploration | Ottoman, Ming, Aztec, Inca, Hapsburg |
| 1800 AD | Revolutionary Era | Napoleon, British Empire, Qing, Mughal decline |
| 1914 | WWI Eve | Colonial empires at peak |
| 1945 | End of WWII | Allied victory, new world order forming |

### MVP Features

1. World basemap (OpenStreetMap via Leaflet)
2. Era timeline bar at bottom — 7 clickable buttons
3. Historical border overlay — GeoJSON polygons, colored by region/empire
4. Region click → info panel (name + narrative paragraph)
5. Current era label displayed on map

### Implementation Steps

#### Step 1 — Project Scaffolding
- [ ] Init React + Vite app in `frontend/`
- [ ] Init Express server in `backend/`
- [ ] Root `package.json` with `dev` script (concurrently)
- [ ] `.gitignore` for node_modules, .env, dist

#### Step 2 — Backend: Data & API
- [ ] Download and curate GeoJSON for 7 eras from `historical-country-borders-3857`
- [ ] Write narrative JSON for ~10 major regions per era (70 total entries)
- [ ] `GET /api/eras` — returns list of available years + labels
- [ ] `GET /api/borders/:year` — returns GeoJSON for that era
- [ ] `GET /api/narratives/:year/:regionId` — returns narrative for a region

#### Step 3 — Frontend: Map
- [ ] Leaflet map fills viewport
- [ ] react-leaflet setup with OpenStreetMap tiles
- [ ] GeoJSON layer component that re-renders when era changes

#### Step 4 — Frontend: Timeline
- [ ] Timeline bar at bottom of screen
- [ ] 7 era buttons, active state styling
- [ ] Clicking fetches new GeoJSON from backend and updates overlay

#### Step 5 — Frontend: Info Panel
- [ ] Click polygon → slide-in panel from right
- [ ] Shows: region name, era year, narrative text
- [ ] Close button, click-outside to dismiss

#### Step 6 — Polish
- [ ] Consistent color palette per empire/culture group
- [ ] Loading spinner during GeoJSON fetch
- [ ] Mobile-responsive layout
- [ ] Hover tooltip on polygons (region name)

---

## Phase 2 — Timeline Scrubber

**Goal:** Smooth year-by-year navigation (not just 7 snapshots).

- Continuous horizontal scrubber (e.g. 200 BC → 1945)
- GeoJSON data for every 50-year interval
- Animated polygon transitions as borders shift
- "Play" button to auto-advance through time

---

## Phase 3 — Depth & Discovery

**Goal:** Make it a genuinely educational and engaging experience.

- Richer narratives — more regions, more eras
- AI-generated narratives (Claude API) for regions without hand-curated content
- Event pins — battles, treaties, discoveries pinned on the map
- Simultaneous world view — see what was happening in different continents at the same moment
- Search by civilization, event, person, or place

---

## Phase 4 — Community

**Goal:** Let users contribute and explore deeply.

- User accounts
- Community-submitted narratives and corrections
- Custom era bookmarks
- Share a specific era + region as a link

---

## Data Strategy

**MVP:** Use `historical-country-borders-3857` GeoJSON snapshots directly. Minimal manual curation needed.

**Phase 2+:** May need to merge/supplement with:
- [Natural Earth](https://www.naturalearthdata.com/) for modern basemap detail
- [World Historical Gazetteer](https://whgazetteer.org/) for place names
- Custom GeoJSON for pre-1000 AD eras (less coverage in open datasets)

---

## Scope Boundary

**Maximum coverage: 1945 (end of WWII).** Post-1945 borders involve ongoing territorial disputes, sensitive geopolitics, and contested sovereignty — outside the scope of this project. 1945 is a natural and historically significant endpoint: the old colonial world order ends, the modern era begins.

---

## Design Principles

1. **Map first** — the map is the product, UI chrome is secondary
2. **Fast** — era switches should feel instant (preload adjacent eras)
3. **Humble scope** — ship something real before adding features
4. **Accurate but accessible** — historical accuracy matters, but readable narratives over academic prose
