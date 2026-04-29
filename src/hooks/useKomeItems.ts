import { useState, useEffect, useCallback } from "react";
import { fetchKomeItems } from "../services/kome.services";
import type { KomeItem } from "../interfaces/content.interface";

export function useKomeItems() {
  const [items, setItems] = useState<KomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchKomeItems()
      .then((data) => { if (!cancelled) { setItems(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setItems([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [key]);

  const refetch = useCallback(() => { setLoading(true); setKey((k) => k + 1); }, []);
  return { items, loading, refetch };
}
