import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { StationPlace } from "../interfaces/homepage.interface";

export function useStationActivities(stationId: string | null) {
  const [activities, setActivities] = useState<StationPlace[]>([]);
  const [loading, setLoading] = useState(!!stationId);
  const [key, setKey] = useState(0);

  const [prevStationId, setPrevStationId] = useState(stationId);
  if (stationId !== prevStationId) {
    setPrevStationId(stationId);
    setActivities([]);
    setLoading(!!stationId);
  }

  useEffect(() => {
    if (!stationId) return;
    let cancelled = false;
    getDocs(collection(db, "stations", stationId, "activities"))
      .then((snap) => {
        if (!cancelled) {
          setActivities(
            snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StationPlace),
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setActivities([]);
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

  return { activities, loading, refetch };
}
