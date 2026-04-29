import { useState, useEffect, useCallback } from "react";
import { fetchRecommendItems } from "../services/recommend.services";
import type { RecommendItem } from "../interfaces/content.interface";

export function useRecommendItems(category: string) {
  const [items, setItems] = useState<RecommendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchRecommendItems(category)
      .then((data) => { if (!cancelled) { setItems(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setItems([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [category, key]);

  const refetch = useCallback(() => { setLoading(true); setKey((k) => k + 1); }, []);
  return { items, loading, refetch };
}
