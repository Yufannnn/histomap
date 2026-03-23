import { useState, useEffect, useRef } from 'react';
import './InfoPanel.css';

function InfoPanel({ region, era, onClose }) {
  const props = region.properties;
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    setLoading(true);
    setNarrative(null);

    fetch(`/api/narratives/${era.yearKey}/${props.region_id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setNarrative(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [era.yearKey, props.region_id]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  const accentColor = props.color || '#c0392b';

  return (
    <div className={`info-overlay ${visible ? 'open' : ''}`} onClick={handleClose}>
      <aside
        ref={panelRef}
        className={`info-panel ${visible ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{ '--accent': accentColor }}
      >
        <div className="panel-accent-bar" />

        <button className="close-btn" onClick={handleClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="panel-header anim-item" style={{ '--i': 0 }}>
          <div className="panel-era-tag">{era.label} · {era.subtitle}</div>
          <h2 className="panel-title">{props.name}</h2>
        </div>

        {loading && (
          <div className="panel-loading-wrap anim-item" style={{ '--i': 1 }}>
            <div className="panel-loading-bar" />
            <div className="panel-loading-bar short" />
          </div>
        )}

        {!loading && narrative && (
          <>
            <div className="panel-meta-grid anim-item" style={{ '--i': 1 }}>
              {narrative.ruler && (
                <div className="panel-meta-item">
                  <span className="meta-icon">👑</span>
                  <div>
                    <span className="meta-label">Ruler</span>
                    <span className="meta-value">{narrative.ruler}</span>
                  </div>
                </div>
              )}
              {narrative.capital && (
                <div className="panel-meta-item">
                  <span className="meta-icon">🏛</span>
                  <div>
                    <span className="meta-label">Capital</span>
                    <span className="meta-value">{narrative.capital}</span>
                  </div>
                </div>
              )}
              {narrative.population_estimate && (
                <div className="panel-meta-item">
                  <span className="meta-icon">👥</span>
                  <div>
                    <span className="meta-label">Population</span>
                    <span className="meta-value">{narrative.population_estimate}</span>
                  </div>
                </div>
              )}
            </div>

            <p className="panel-summary anim-item" style={{ '--i': 2 }}>
              {narrative.summary}
            </p>

            {narrative.key_events?.length > 0 && (
              <div className="panel-section anim-item" style={{ '--i': 3 }}>
                <h3 className="panel-section-title">Key Events</h3>
                <ul className="panel-events">
                  {narrative.key_events.map((evt, i) => (
                    <li key={i} className="event-item" style={{ '--ei': i }}>
                      {evt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {narrative.did_you_know && (
              <div className="panel-factoid anim-item" style={{ '--i': 4 }}>
                <strong>Did you know?</strong>
                <p>{narrative.did_you_know}</p>
              </div>
            )}
          </>
        )}

        {!loading && !narrative && (
          <p className="panel-no-data anim-item" style={{ '--i': 1 }}>
            No detailed record available for this region in {era.label}.
          </p>
        )}

        {props.modern_territory && (
          <div className="panel-modern anim-item" style={{ '--i': 5 }}>
            <span className="meta-label">Modern territory</span>
            <span>{props.modern_territory}</span>
          </div>
        )}
      </aside>
    </div>
  );
}

export default InfoPanel;
