"use client";

import { useEffect, useState } from "react";

export interface Draft {
  themeLine: string;
  blocks: string[];
  closer: string;
}

const KEY = "znb.drafts.v1";

export const emptyDraft = (): Draft => ({
  themeLine: "",
  blocks: ["", "", ""],
  closer: "",
});

function readAll(): Record<number, Draft> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// word count of the drafted body only (what the writer has actually typed)
export function draftWords(d: Draft | undefined): number {
  if (!d) return 0;
  const text = [d.themeLine, ...d.blocks, d.closer].join(" ").trim();
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

// Hook for the whole draft map (dashboard reads this).
export function useDrafts() {
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDrafts(readAll());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setDrafts(readAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = (n: number, d: Draft) => {
    setDrafts((prev) => {
      const next = { ...prev, [n]: d };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { drafts, save, ready };
}
