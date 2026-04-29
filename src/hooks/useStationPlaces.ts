import { useState, useEffect, useCallback } from "react";
import { fetchPlaces } from "../services/homepage.services";
import type { StationPlace } from "../interfaces/homepage.interface";

export function useStationPlaces(stationId: string | null) {
  const [places, setPlaces] = useState<StationPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!stationId) return;
    let cancelled = false;
    fetchPlaces(stationId)
      .then((data) => { if (!cancelled) { setPlaces(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setPlaces([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [stationId, key]);

  const refetch = useCallback(() => { setLoading(true); setKey((k) => k + 1); }, []);
  return { places, loading, refetch };
}
