import { useRef, useEffect, useState } from 'react';
import './Timeline.css';

function Timeline({ eras, selectedEra, onEraChange }) {
  const trackRef = useRef(null);
  const [glowLeft, setGlowLeft] = useState(0);
  const selectedIdx = eras.findIndex((e) => e.yearKey === selectedEra.yearKey);

  useEffect(() => {
    if (!trackRef.current) return;
    const activeBtn = trackRef.current.querySelector('.era-dot.active');
    if (activeBtn) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setGlowLeft(btnRect.left - trackRect.left + btnRect.width / 2);
    }
  }, [selectedEra]);

  // Progress line width as percentage
  const progressPct = (selectedIdx / (eras.length - 1)) * 100;

  return (
    <div className="timeline-bar">
      <div className="timeline-inner">
        <div className="timeline-track" ref={trackRef}>
          {/* Base line */}
          <div className="timeline-line" />
          {/* Filled progress line */}
          <div className="timeline-progress" style={{ width: `${progressPct}%` }} />
          {/* Glow under active */}
          <div className="timeline-glow" style={{ left: glowLeft }} />

          {eras.map((era, i) => {
            const isActive = era.yearKey === selectedEra.yearKey;
            const isPast = i <= selectedIdx;
            return (
              <button
                key={era.yearKey}
                className={`era-dot ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                onClick={() => onEraChange(era)}
              >
                <div className="dot-marker">
                  <div className="dot-ring" />
                  <div className="dot-center" />
                </div>
                <span className="dot-year">{era.label}</span>
                <span className="dot-subtitle">{era.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
