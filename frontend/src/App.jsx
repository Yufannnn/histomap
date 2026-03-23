import { useState, useEffect, useRef, useCallback } from 'react';
import EraSection from './components/EraSection.jsx';
import SideNav from './components/SideNav.jsx';
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
  const [narratives, setNarratives] = useState({});
  const [activeEra, setActiveEra] = useState(ERAS[0].yearKey);
  const sectionRefs = useRef({});

  // Fetch all narratives on mount
  useEffect(() => {
    Promise.all(
      ERAS.map((era) =>
        fetch(`/api/narratives/${era.yearKey}`)
          .then((r) => (r.ok ? r.json() : {}))
          .then((data) => [era.yearKey, data])
      )
    ).then((results) => {
      const map = {};
      for (const [key, data] of results) map[key] = data;
      setNarratives(map);
    });
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveEra(entry.target.dataset.era);
          }
        }
      },
      { threshold: [0.3, 0.6] }
    );

    for (const ref of Object.values(sectionRefs.current)) {
      if (ref) observer.observe(ref);
    }
    return () => observer.disconnect();
  }, [narratives]);

  const scrollToEra = useCallback((yearKey) => {
    const el = sectionRefs.current[yearKey];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSearchSelect = useCallback((result) => {
    scrollToEra(result.yearKey);
  }, [scrollToEra]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">HISTOMAP</span>
          <div className="header-divider" />
          <span className="header-tagline">A journey through the ages</span>
        </div>
        <div className="header-right">
          <span className="header-credit">by Henry Zhu Yufan</span>
        </div>
      </header>

      <Search onSelect={handleSearchSelect} />
      <SideNav eras={ERAS} activeEra={activeEra} onNavigate={scrollToEra} />

      <main className="scroll-container">
        {ERAS.map((era, i) => (
          <EraSection
            key={era.yearKey}
            era={era}
            index={i}
            narratives={narratives[era.yearKey] || {}}
            ref={(el) => (sectionRefs.current[era.yearKey] = el)}
          />
        ))}
        <footer className="app-footer">
          <p>HISTOMAP — An interactive journey through history</p>
          <p className="footer-credit">Created by Henry Zhu Yufan · Data from historical-basemaps</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
