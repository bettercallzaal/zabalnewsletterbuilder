"use client";

import { useEffect, useState } from "react";

const KEY = "znb.notes.v1";

// Per-issue "what landed" notes: what resonated, what to change next time.
export function useNotes() {
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const set = (n: number, text: string) => {
    setNotes((prev) => {
      const next = { ...prev, [n]: text };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { notes, set, ready };
}
