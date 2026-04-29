import { useState, useEffect, useCallback } from "react";
import { fetchEmergencyItems } from "../services/contact.services";
import type { EmergencyItem } from "../interfaces/content.interface";

export function useEmergencyItems() {
  const [items, setItems] = useState<EmergencyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchEmergencyItems()
      .then((data) => { if (!cancelled) { setItems(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setItems([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [key]);

  const refetch = useCallback(() => { setLoading(true); setKey((k) => k + 1); }, []);
  return { items, loading, refetch };
}
