import './SideNav.css';

function SideNav({ eras, activeEra, onNavigate }) {
  return (
    <nav className="side-nav">
      {eras.map((era) => (
        <button
          key={era.yearKey}
          className={`side-dot ${era.yearKey === activeEra ? 'active' : ''}`}
          onClick={() => onNavigate(era.yearKey)}
          aria-label={`${era.label} — ${era.subtitle}`}
        >
          <span className="dot-pip" />
          <span className="dot-label">{era.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default SideNav;
