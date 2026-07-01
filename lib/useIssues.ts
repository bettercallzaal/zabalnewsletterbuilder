"use client";

import { useEffect, useState } from "react";
import { issues as seed, type Issue } from "@/lib/issues";

const KEY = "znb.issues.v1";

interface Store {
  overrides: Record<number, { theme?: string; wins?: string[]; need?: string }>;
  custom: Issue[];
  deleted: number[];
  order: number[]; // issue numbers in display order
}

const emptyStore: Store = { overrides: {}, custom: [], deleted: [], order: [] };

function compute(store: Store): Issue[] {
  const base = [...seed, ...store.custom];
  const alive = base.filter((i) => !store.deleted.includes(i.n));
  const withOverrides = alive.map((i) => {
    const o = store.overrides[i.n];
    return o ? { ...i, ...(o.theme ? { theme: o.theme } : {}), ...(o.wins ? { wins: o.wins } : {}), ...(o.need ? { need: o.need } : {}) } : i;
  });
  // order: those in store.order first (in that order), rest by n
  const rank = new Map(store.order.map((n, idx) => [n, idx]));
  return withOverrides.sort((a, b) => {
    const ra = rank.has(a.n) ? rank.get(a.n)! : 1000 + a.n;
    const rb = rank.has(b.n) ? rank.get(b.n)! : 1000 + b.n;
    return ra - rb;
  });
}

export function useIssues() {
  const [store, setStore] = useState<Store>(emptyStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStore({ ...emptyStore, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  function persist(next: Store) {
    setStore(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  const list = compute(store);

  function nextN(): number {
    const all = [...seed.map((i) => i.n), ...store.custom.map((i) => i.n)];
    return Math.max(0, ...all) + 1;
  }

  function addIssue(theme: string, wins: string[]) {
    const n = nextN();
    const issue: Issue = {
      n,
      theme: theme || `Issue ${n}`,
      status: "draft",
      wins: wins.length ? wins : ["", "", ""],
      need: "",
    };
    persist({
      ...store,
      custom: [...store.custom, issue],
      order: [...list.map((i) => i.n), n],
    });
  }

  function updateIssue(n: number, patch: { theme?: string; wins?: string[]; need?: string }) {
    persist({ ...store, overrides: { ...store.overrides, [n]: { ...store.overrides[n], ...patch } } });
  }

  function deleteIssue(n: number) {
    // custom issues are removed outright; seeded ones go on the deleted list
    const isCustom = store.custom.some((i) => i.n === n);
    persist({
      ...store,
      custom: isCustom ? store.custom.filter((i) => i.n !== n) : store.custom,
      deleted: isCustom ? store.deleted : [...store.deleted, n],
      order: store.order.filter((x) => x !== n),
    });
  }

  function move(n: number, dir: -1 | 1) {
    const order = list.map((i) => i.n);
    const idx = order.indexOf(n);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= order.length) return;
    [order[idx], order[j]] = [order[j], order[idx]];
    persist({ ...store, order });
  }

  function reset() {
    setStore(emptyStore);
    localStorage.removeItem(KEY);
  }

  return { list, ready, addIssue, updateIssue, deleteIssue, move, reset };
}
