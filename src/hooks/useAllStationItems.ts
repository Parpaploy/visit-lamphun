import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { STATION_ID_MAP } from "../constant/homepage";
import type { StationPlace } from "../interfaces/homepage.interface";

export type StationItemKind = "store" | "activity" | "toilet";

export type StationItemGroup = {
  stationNumber: number;
  stationId: string;
  items: StationPlace[];
};

const COLLECTION: Record<StationItemKind, string> = {
  store: "places",
  activity: "activities",
  toilet: "toilets",
};

type WithCreatedAt = { createdAt?: { seconds?: number } };
const byCreatedAt = (a: WithCreatedAt, b: WithCreatedAt) =>
  (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0);

// Items of one kind from every station, grouped in route order.
// Fetched only while `kind` is set, and cached per kind for the session.
export function useAllStationItems(kind: StationItemKind | null) {
  const [cache, setCache] = useState<
    Partial<Record<StationItemKind, StationItemGroup[]>>
  >({});

  useEffect(() => {
    if (!kind || cache[kind]) return;
    let cancelled = false;

    const stations = Object.entries(STATION_ID_MAP)
      .map(([num, id]) => ({ stationNumber: Number(num), stationId: id }))
      .sort((a, b) => a.stationNumber - b.stationNumber);

    Promise.all(
      stations.map(async (s) => {
        try {
          const snap = await getDocs(
            collection(db, "stations", s.stationId, COLLECTION[kind]),
          );
          const items = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }) as WithCreatedAt)
            .sort(byCreatedAt) as unknown as StationPlace[];
          return { ...s, items };
        } catch {
          return { ...s, items: [] };
        }
      }),
    ).then((groups) => {
      if (!cancelled) setCache((c) => ({ ...c, [kind]: groups }));
    });

    return () => {
      cancelled = true;
    };
  }, [kind, cache]);

  return {
    groups: kind ? (cache[kind] ?? []) : [],
    loading: !!kind && !cache[kind],
  };
}
