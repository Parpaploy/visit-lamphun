import { useState, useEffect, useCallback } from "react";
import {
  fetchTrainItems, fetchTramItems, fetchOtherItems,
} from "../services/travel.services";
import type { TrainItem, TramItem, OtherItem } from "../interfaces/content.interface";

export function useTrainItems() {
  const [items, setItems] = useState<TrainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  useEffect(() => {
    let c = false;
    fetchTrainItems()
      .then((d) => { if (!c) { setItems(d); setLoading(false); } })
      .catch(() => { if (!c) { setItems([]); setLoading(false); } });
    return () => { c = true; };
  }, [key]);
  const refetch = useCallback(() => { setLoading(true); setKey((k) => k + 1); }, []);
  return { items, loading, refetch };
}

export function useTramItems() {
  const [items, setItems] = useState<TramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  useEffect(() => {
    let c = false;
    fetchTramItems()
      .then((d) => { if (!c) { setItems(d); setLoading(false); } })
      .catch(() => { if (!c) { setItems([]); setLoading(false); } });
    return () => { c = true; };
  }, [key]);
  const refetch = useCallback(() => { setLoading(true); setKey((k) => k + 1); }, []);
  return { items, loading, refetch };
}

export function useOtherItems() {
  const [items, setItems] = useState<OtherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  useEffect(() => {
    let c = false;
    fetchOtherItems()
      .then((d) => { if (!c) { setItems(d); setLoading(false); } })
      .catch(() => { if (!c) { setItems([]); setLoading(false); } });
    return () => { c = true; };
  }, [key]);
  const refetch = useCallback(() => { setLoading(true); setKey((k) => k + 1); }, []);
  return { items, loading, refetch };
}
