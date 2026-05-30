import { useState, useEffect, useCallback } from "react";
import { fetchStationPopup } from "../services/homepage.services";
import type { StationPopupData } from "../interfaces/content.interface";

export function useStationPopup(stationId: string | null) {
  const [data, setData] = useState<StationPopupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!stationId) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    fetchStationPopup(stationId)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
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

  return { data, loading, refetch };
}
