import { useState, useCallback } from 'react';
import Map from './components/Map.jsx';
import Timeline from './components/Timeline.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import Search from './components/Search.jsx';
import './App.css';

const ERAS = [
  { year: 1,    yearKey: '0001', label: '1 AD',    subtitle: 'Roman Empire Era' },
  { year: 500,  yearKey: '0500', label: '500 AD',  subtitle: 'Fall of Rome' },
  { year: 1000, yearKey: '1000', label: '1000 AD', subtitle: 'Medieval World' },
  { year: 1500, yearKey: '1500', label: '1500 AD', subtitle: 'Age of Exploration' },
  { year: 1800, yearKey: '1800', label: '1800 AD', subtitle: 'Revolutionary Era' },
  { year: 1914, yearKey: '1914', label: '1914',    subtitle: 'WWI Eve' },
  { year: 1945, yearKey: '1945', label: '1945',    subtitle: 'End of WWII' },
];

function App() {
  const [selectedEra, setSelectedEra] = useState(ERAS[0]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  function handleEraChange(era) {
    setSelectedEra(era);
    setSelectedRegion(null);
  }

  const handleSearchSelect = useCallback((result) => {
    const era = ERAS.find((e) => e.yearKey === result.yearKey);
    if (era) {
      setSelectedEra(era);
      // Create a minimal feature object so InfoPanel can fetch the narrative
      setSelectedRegion({
        properties: {
          region_id: result.regionId,
          name: result.name,
          culture_group: result.culture,
          color: result.color,
        },
      });
    }
  }, []);

  return (
    <div className="app-shell">
      <Search onSelect={handleSearchSelect} />
      <header className="app-title">
        <div className="app-title-left">
          <span className="app-title-logo">HISTOMAP</span>
          <div className="app-title-divider" />
          <span className="app-title-tagline">A journey through the ages</span>
        </div>
        <div className="app-title-right">
          <span className="app-title-credit">by Henry Zhu Yufan</span>
        </div>
      </header>
      <Map
        era={selectedEra}
        onRegionClick={setSelectedRegion}
        selectedRegion={selectedRegion}
      />
      <Timeline
        eras={ERAS}
        selectedEra={selectedEra}
        onEraChange={handleEraChange}
      />
      {selectedRegion && (
        <InfoPanel
          region={selectedRegion}
          era={selectedEra}
          onClose={() => setSelectedRegion(null)}
        />
      )}
    </div>
  );
}

export default App;
