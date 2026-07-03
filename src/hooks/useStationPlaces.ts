import { useState, useEffect, useCallback } from "react";
import { fetchPlaces } from "../services/homepage.services";
import type { StationPlace } from "../interfaces/homepage.interface";

export function useStationPlaces(stationId: string | null) {
  const [places, setPlaces] = useState<StationPlace[]>([]);
  const [loading, setLoading] = useState(!!stationId);
  const [key, setKey] = useState(0);

  const [prevStationId, setPrevStationId] = useState(stationId);
  if (stationId !== prevStationId) {
    setPrevStationId(stationId);
    setPlaces([]);
    setLoading(!!stationId);
  }

  useEffect(() => {
    if (!stationId) return;
    let cancelled = false;
    fetchPlaces(stationId)
      .then((data) => {
        if (!cancelled) {
          setPlaces(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPlaces([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [stationId, key]);

  const refetch = useCallback(() => {
    setLoading(true);
    setKey((k) => k + 1);
  }, []);

  return { places, loading, refetch };
}
