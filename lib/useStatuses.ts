"use client";

import { useEffect, useState } from "react";
import { issues, type IssueStatus } from "@/lib/issues";

const KEY = "znb.statuses.v1";

// Live, persisted status map keyed by issue number.
export function useStatuses() {
  const seed = () =>
    Object.fromEntries(issues.map((i) => [i.n, i.status])) as Record<
      number,
      IssueStatus
    >;

  const [statuses, setStatuses] = useState<Record<number, IssueStatus>>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStatuses({ ...seed(), ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(statuses));
  }, [statuses, ready]);

  const cycle = (n: number) => {
    const order: IssueStatus[] = ["draft", "next", "queued", "shipped"];
    setStatuses((s) => {
      const cur = s[n];
      const next = order[(order.indexOf(cur) + 1) % order.length];
      return { ...s, [n]: next };
    });
  };

  const reset = () => setStatuses(seed());

  return { statuses, cycle, reset, ready };
}
