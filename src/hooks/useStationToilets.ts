import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { StationPlace } from "../interfaces/homepage.interface";

export function useStationToilets(stationId: string | null) {
  const [toilets, setToilets] = useState<StationPlace[]>([]);
  const [loading, setLoading] = useState(!!stationId);
  const [key, setKey] = useState(0);

  const [prevStationId, setPrevStationId] = useState(stationId);
  if (stationId !== prevStationId) {
    setPrevStationId(stationId);
    setToilets([]);
    setLoading(!!stationId);
  }

  useEffect(() => {
    if (!stationId) return;
    let cancelled = false;
    getDocs(collection(db, "stations", stationId, "toilets"))
      .then((snap) => {
        if (!cancelled) {
          setToilets(
            snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StationPlace),
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setToilets([]);
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

  return { toilets, loading, refetch };
}
