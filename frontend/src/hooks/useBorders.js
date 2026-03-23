import { useState, useEffect } from 'react';

export function useBorders(yearKey) {
  const [geojson, setGeojson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!yearKey) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(`/api/borders/${yearKey}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setGeojson(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [yearKey]);

  return { geojson, loading, error };
}
