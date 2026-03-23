import { useCallback, useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'proj4';
import 'proj4leaflet';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { useBorders } from '../hooks/useBorders.js';
import './Map.css';

// Miller Cylindrical projection
const millerCRS = new L.Proj.CRS(
  'ESRI:54003',
  '+proj=mill +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R_A +datum=WGS84 +units=m +no_defs',
  {
    resolutions: [
      100000, 50000, 25000, 12500, 6250, 3125, 1562.5, 781.25, 390.625, 195.3125
    ],
  }
);

// Rough geographic extent (bounding box area in degrees²)
function geoExtent(geometry) {
  let lons = [], lats = [];
  function extract(c) {
    if (typeof c[0] === 'number') { lons.push(c[0]); lats.push(c[1]); return; }
    for (const item of c) extract(item);
  }
  extract(geometry.coordinates);
  if (lons.length === 0) return 0;
  return (Math.max(...lons) - Math.min(...lons)) * (Math.max(...lats) - Math.min(...lats));
}

const VINTAGE_COLORS = {
  mediterranean: '#a83232',
  east_asian: '#c47a1a',
  south_asian: '#d4952e',
  islamic: '#2d7a45',
  germanic: '#2a5a8f',
  steppe: '#6b3a7d',
  mesoamerican: '#1a7a6a',
  african: '#b85a1a',
  colonial: '#7a4a8a',
  other: '#8a8070',
};

const CULTURE_LABELS = {
  mediterranean: 'Mediterranean / Roman',
  east_asian: 'East Asian',
  south_asian: 'South Asian',
  islamic: 'Islamic World',
  germanic: 'Germanic / Northern European',
  steppe: 'Steppe Nomads',
  mesoamerican: 'Mesoamerican',
  african: 'African',
  other: 'Other Peoples',
};

function featureStyle(feature) {
  const props = feature.properties;
  const precision = props.BORDERPRECISION || 1;
  const culture = props.culture_group || 'other';
  const isTribal = culture === 'other' && precision === 1;
  // Always use JS palette so colors match the legend exactly
  const color = VINTAGE_COLORS[culture] || VINTAGE_COLORS.other;

  return {
    fillColor: color,
    fillOpacity: isTribal ? 0.15 : precision === 3 ? 0.5 : 0.38,
    color: isTribal ? 'rgba(80,60,40,0.15)' : 'rgba(60,40,20,0.45)',
    weight: precision === 3 ? 1.5 : isTribal ? 0.3 : 0.8,
    dashArray: precision === 1 ? '4 3' : null,
  };
}

// Fit the whole world on initial load and on resize
function MapFitter() {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    const fit = () => {
      map.invalidateSize();
      if (!fitted.current) {
        map.fitBounds([[-58, -165], [75, 180]], { animate: false });
        fitted.current = true;
      }
    };
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    setTimeout(fit, 200);
    return () => window.removeEventListener('resize', onResize);
  }, [map]);
  return null;
}

function Legend() {
  const [collapsed, setCollapsed] = useState(false);
  const groups = Object.entries(VINTAGE_COLORS).filter(([k]) => k !== 'colonial');

  return (
    <div className={`map-legend ${collapsed ? 'collapsed' : ''}`}>
      <button className="legend-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '◀ Legend' : '▶'}
      </button>
      {!collapsed && (
        <div className="legend-items">
          <div className="legend-title">Culture Groups</div>
          {groups.map(([key, color]) => (
            <div className="legend-item" key={key}>
              <span className="legend-swatch" style={{ background: color }} />
              <span className="legend-label">{CULTURE_LABELS[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Map({ era, onRegionClick }) {
  const { geojson, loading } = useBorders(era.yearKey);
  const [transitioning, setTransitioning] = useState(false);
  const [displayedEra, setDisplayedEra] = useState(era);
  const [displayedGeojson, setDisplayedGeojson] = useState(null);
  const prevEraRef = useRef(era.yearKey);

  useEffect(() => {
    if (era.yearKey !== prevEraRef.current) {
      setTransitioning(true);
      prevEraRef.current = era.yearKey;
    }
  }, [era.yearKey]);

  useEffect(() => {
    if (geojson && transitioning) {
      const timer = setTimeout(() => {
        setDisplayedGeojson(geojson);
        setDisplayedEra(era);
        setTransitioning(false);
      }, 350);
      return () => clearTimeout(timer);
    } else if (geojson && !displayedGeojson) {
      setDisplayedGeojson(geojson);
      setDisplayedEra(era);
    }
  }, [geojson, transitioning, era]);

  const onEachFeature = useCallback(
    (feature, layer) => {
      const baseStyle = featureStyle(feature);
      const props = feature.properties;
      const name = props.name || props.NAME;
      const culture = props.culture_group || 'other';
      const extent = geoExtent(feature.geometry);

      const skip = /(hunter|gatherer|peoples|fisher|bison|desert|savanna|subarctic|taiga|arctic|mammal|forag|malay|caribbean|amazon|saharan|aboriginal|paleo)/i;
      if (name && culture !== 'other' && extent > 700 && !skip.test(name)) {
        const short = name.length > 22 ? name.split(/[(/]/)[0].trim() : name;
        layer.bindTooltip(short, {
          permanent: true,
          direction: 'center',
          className: 'ancient-label major',
          interactive: false,
        });
      }

      layer.on({
        click: () => onRegionClick(feature),
        mouseover: (e) => {
          e.target.setStyle({
            fillOpacity: 0.6,
            weight: 2,
            color: 'rgba(40,30,15,0.8)',
            dashArray: null,
          });
        },
        mouseout: (e) => {
          e.target.setStyle(baseStyle);
        },
      });
    },
    [onRegionClick]
  );

  return (
    <div className="map-wrapper">
      <div className={`map-loading ${loading ? 'visible' : ''}`}>
        <div className="spinner" />
        <span>Loading {era.label}</span>
      </div>

      <div className={`era-badge ${transitioning ? 'fading' : ''}`}>
        <span className="era-badge-year">{displayedEra.label}</span>
        <span className="era-badge-sep">—</span>
        <span className="era-badge-subtitle">{displayedEra.subtitle}</span>
      </div>

      <Legend />

      <div className={`geojson-fade ${transitioning ? 'out' : 'in'}`}>
        <MapContainer
          center={[20, 10]}
          zoom={1}
          minZoom={0}
          maxZoom={8}
          crs={millerCRS}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          worldCopyJump={false}
        >
          <MapFitter />
          {displayedGeojson && (
            <GeoJSON
              key={displayedEra.yearKey}
              data={displayedGeojson}
              style={featureStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
