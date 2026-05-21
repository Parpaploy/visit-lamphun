import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { Tram } from "../interfaces/tram.interface";

export function useTramPosition(tramId: string) {
  const [tram, setTram] = useState<Tram | null>(null);

  useEffect(() => {
    if (!tramId) return;
    const unsub = onSnapshot(doc(db, "trams", tramId), (snap) => {
      if (snap.exists()) setTram({ id: snap.id, ...snap.data() } as Tram);
      else setTram(null);
    });
    return () => unsub();
  }, [tramId]);

  return tram;
}
