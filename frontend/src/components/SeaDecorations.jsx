import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// SVG sea decorations positioned on ocean areas
const DECORATIONS = [
  // Compass rose — North Atlantic
  {
    pos: [-30, -30],
    size: 120,
    svg: `<svg viewBox="0 0 100 100" opacity="0.15">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#5a4a30" stroke-width="0.8"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#5a4a30" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="3" fill="#5a4a30"/>
      <path d="M50 10 L53 45 L50 38 L47 45Z" fill="#8a6a40"/>
      <path d="M50 90 L53 55 L50 62 L47 55Z" fill="#5a4a30"/>
      <path d="M10 50 L45 47 L38 50 L45 53Z" fill="#5a4a30"/>
      <path d="M90 50 L55 47 L62 50 L55 53Z" fill="#5a4a30"/>
      <path d="M27 27 L46 44 L44 46Z" fill="#5a4a30" opacity="0.5"/>
      <path d="M73 27 L54 44 L56 46Z" fill="#5a4a30" opacity="0.5"/>
      <path d="M27 73 L44 54 L46 56Z" fill="#5a4a30" opacity="0.5"/>
      <path d="M73 73 L56 54 L54 56Z" fill="#5a4a30" opacity="0.5"/>
      <text x="50" y="7" text-anchor="middle" font-size="6" fill="#5a4a30" font-family="serif" font-weight="bold">N</text>
      <text x="50" y="98" text-anchor="middle" font-size="6" fill="#5a4a30" font-family="serif">S</text>
      <text x="4" y="52" text-anchor="middle" font-size="6" fill="#5a4a30" font-family="serif">W</text>
      <text x="96" y="52" text-anchor="middle" font-size="6" fill="#5a4a30" font-family="serif">E</text>
    </svg>`,
  },
  // Sea serpent — Pacific
  {
    pos: [5, -150],
    size: 140,
    svg: `<svg viewBox="0 0 200 80" opacity="0.1">
      <path d="M10 50 C30 20 50 60 70 30 C90 0 110 50 130 25 C150 5 160 40 180 30"
        fill="none" stroke="#5a4a30" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="10" cy="50" r="5" fill="#5a4a30"/>
      <circle cx="8" cy="48" r="1.5" fill="#e8dcc8"/>
      <path d="M180 30 L195 22 M180 30 L195 35" stroke="#5a4a30" stroke-width="1.5"/>
      <path d="M50 60 C52 70 56 72 60 68" fill="none" stroke="#5a4a30" stroke-width="1"/>
      <path d="M90 10 C92 0 96 -2 100 4" fill="none" stroke="#5a4a30" stroke-width="1"/>
      <path d="M130 30 C132 40 136 42 140 36" fill="none" stroke="#5a4a30" stroke-width="1"/>
    </svg>`,
  },
  // Sailing ship — Indian Ocean
  {
    pos: [-20, 70],
    size: 80,
    svg: `<svg viewBox="0 0 100 100" opacity="0.12">
      <path d="M30 70 Q50 75 70 70 L65 72 Q50 78 35 72Z" fill="#5a4a30"/>
      <line x1="50" y1="30" x2="50" y2="72" stroke="#5a4a30" stroke-width="1.5"/>
      <path d="M50 30 Q70 45 52 65" fill="none" stroke="#5a4a30" stroke-width="1"/>
      <path d="M50 30 L68 45 L52 60Z" fill="#5a4a30" opacity="0.3"/>
      <path d="M50 35 Q35 48 48 62" fill="none" stroke="#5a4a30" stroke-width="0.8"/>
      <path d="M50 35 L36 48 L48 58Z" fill="#5a4a30" opacity="0.2"/>
      <line x1="25" y1="73" x2="75" y2="73" stroke="#5a4a30" stroke-width="0.5"/>
      <path d="M20 75 Q50 80 80 75" fill="none" stroke="#5a4a30" stroke-width="0.5" opacity="0.5"/>
    </svg>`,
  },
  // Kraken / Octopus — South Atlantic
  {
    pos: [-40, -15],
    size: 100,
    svg: `<svg viewBox="0 0 120 100" opacity="0.08">
      <ellipse cx="60" cy="35" rx="20" ry="15" fill="#5a4a30"/>
      <circle cx="52" cy="32" r="4" fill="#e8dcc8"/>
      <circle cx="52" cy="32" r="2" fill="#5a4a30"/>
      <circle cx="68" cy="32" r="4" fill="#e8dcc8"/>
      <circle cx="68" cy="32" r="2" fill="#5a4a30"/>
      <path d="M45 48 C30 60 20 80 15 90" fill="none" stroke="#5a4a30" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 50 C40 65 35 80 38 95" fill="none" stroke="#5a4a30" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M60 52 C58 70 55 85 60 95" fill="none" stroke="#5a4a30" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M70 50 C78 65 82 80 85 92" fill="none" stroke="#5a4a30" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M75 48 C88 58 95 75 100 88" fill="none" stroke="#5a4a30" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 50 C25 55 12 70 8 82" fill="none" stroke="#5a4a30" stroke-width="2" stroke-linecap="round"/>
      <path d="M78 48 C95 52 105 65 110 80" fill="none" stroke="#5a4a30" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  // Whale — North Pacific
  {
    pos: [35, -170],
    size: 90,
    svg: `<svg viewBox="0 0 160 60" opacity="0.09">
      <path d="M20 35 Q40 15 80 20 Q120 18 135 30 Q140 35 135 38 Q120 45 80 42 Q40 48 20 35Z" fill="#5a4a30"/>
      <circle cx="45" cy="30" r="3" fill="#e8dcc8"/>
      <circle cx="45" cy="30" r="1.5" fill="#3a2a15"/>
      <path d="M135 30 L155 15 L150 32 L155 48 L135 38" fill="#5a4a30" opacity="0.7"/>
      <path d="M75 18 C76 8 78 5 80 8" fill="none" stroke="#5a4a30" stroke-width="1.5"/>
      <path d="M25 36 Q22 40 25 42" fill="none" stroke="#e8dcc8" stroke-width="1" opacity="0.5"/>
    </svg>`,
  },
  // Small ship — Mediterranean area
  {
    pos: [30, 10],
    size: 50,
    svg: `<svg viewBox="0 0 100 100" opacity="0.1">
      <path d="M30 65 Q50 70 70 65 L65 68 Q50 73 35 68Z" fill="#5a4a30"/>
      <line x1="50" y1="35" x2="50" y2="67" stroke="#5a4a30" stroke-width="1.2"/>
      <path d="M50 35 L65 48 L52 58Z" fill="#5a4a30" opacity="0.3"/>
      <path d="M18 72 Q50 78 82 72" fill="none" stroke="#5a4a30" stroke-width="0.5" opacity="0.4"/>
    </svg>`,
  },
  // "Here be dragons" text — deep Pacific
  {
    pos: [-15, 170],
    size: 140,
    svg: `<svg viewBox="0 0 200 30" opacity="0.1">
      <text x="100" y="20" text-anchor="middle" font-family="'Crimson Text', serif" font-style="italic" font-size="14" fill="#5a4a30" letter-spacing="4">Here be Dragons</text>
    </svg>`,
  },
  // Wave pattern — South Pacific
  {
    pos: [-50, -120],
    size: 120,
    svg: `<svg viewBox="0 0 200 40" opacity="0.07">
      <path d="M0 20 Q15 10 30 20 Q45 30 60 20 Q75 10 90 20 Q105 30 120 20 Q135 10 150 20 Q165 30 180 20 Q195 10 200 20" fill="none" stroke="#5a4a30" stroke-width="1.5"/>
      <path d="M10 30 Q25 22 40 30 Q55 38 70 30 Q85 22 100 30 Q115 38 130 30 Q145 22 160 30 Q175 38 190 30" fill="none" stroke="#5a4a30" stroke-width="1"/>
    </svg>`,
  },
];

function SeaDecorations() {
  const map = useMap();

  useEffect(() => {
    const markers = [];

    for (const dec of DECORATIONS) {
      const icon = L.divIcon({
        html: dec.svg,
        className: 'sea-decoration',
        iconSize: [dec.size, dec.size],
        iconAnchor: [dec.size / 2, dec.size / 2],
      });

      const marker = L.marker(dec.pos, {
        icon,
        interactive: false,
        keyboard: false,
      }).addTo(map);

      markers.push(marker);
    }

    return () => {
      for (const m of markers) map.removeLayer(m);
    };
  }, [map]);

  return null;
}

export default SeaDecorations;
