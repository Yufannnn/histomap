import './RoomNav.css';

function RoomNav({
  rooms,
  active,
  onNavigate,
  brand,
  lang,
  setLang,
  languageLabel,
  primaryLabel,
  secondaryLabel,
}) {
  return (
    <nav className="room-nav">
      <button className="room-brand" onClick={() => onNavigate('lobby')}>
        {brand}
      </button>

      <div className="room-tabs">
        {rooms
          .filter((room) => room.id !== 'lobby')
          .map((room) => (
            <button
              key={room.id}
              className={`room-tab ${active === room.id ? 'active' : ''}`}
              onClick={() => onNavigate(room.id)}
            >
              <span className="room-label">{room.label}</span>
            </button>
          ))}
      </div>

      <div className="lang-switch" aria-label={languageLabel}>
        <button
          className={`lang-btn ${lang === 'zh' ? 'active' : ''}`}
          onClick={() => setLang('zh')}
        >
          {primaryLabel}
        </button>
        <button
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
        >
          {secondaryLabel}
        </button>
      </div>
    </nav>
  );
}

export default RoomNav;
