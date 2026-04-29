import { useState, useEffect, useCallback } from "react";
import { fetchPlaces } from "../services/homepage.services";
import type { StationPlace } from "../interfaces/homepage.interface";

export function useStationPlaces(stationId: string | null) {
  const [places, setPlaces] = useState<StationPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!stationId) {
      setPlaces([]);
      return;
    }
    let cancelled = false;
    fetchPlaces(stationId)
      .then((data) => { if (!cancelled) setPlaces(data); })
      .catch(() => { if (!cancelled) setPlaces([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [stationId, key]);

  const refetch = useCallback(() => setKey((k) => k + 1), []);

  return { places, loading, refetch };
}
