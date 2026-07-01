"use client";

import { useEffect, useState } from "react";
import { issues, type IssueStatus } from "@/lib/issues";

const KEY = "znb.statuses.v1";
const LOG_KEY = "znb.shiplog.v1";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// consecutive-day streak ending today (or yesterday) from a set of ship dates
function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  const d = new Date();
  // allow the streak to be "alive" if the last ship was today or yesterday
  const t = today();
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (!set.has(t) && !set.has(y)) return 0;
  if (!set.has(t)) d.setDate(d.getDate() - 1); // start from yesterday
  let streak = 0;
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

export function useStatuses() {
  const seed = () =>
    Object.fromEntries(issues.map((i) => [i.n, i.status])) as Record<
      number,
      IssueStatus
    >;

  const [statuses, setStatuses] = useState<Record<number, IssueStatus>>(seed);
  const [shipLog, setShipLog] = useState<Record<number, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStatuses({ ...seed(), ...JSON.parse(raw) });
      const rawLog = localStorage.getItem(LOG_KEY);
      if (rawLog) setShipLog(JSON.parse(rawLog));
    } catch {
      // ignore
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(statuses));
  }, [statuses, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(LOG_KEY, JSON.stringify(shipLog));
  }, [shipLog, ready]);

  const cycle = (n: number) => {
    const order: IssueStatus[] = ["draft", "next", "queued", "shipped"];
    setStatuses((s) => {
      const cur = s[n];
      const next = order[(order.indexOf(cur) + 1) % order.length];
      if (next === "shipped") {
        setShipLog((l) => ({ ...l, [n]: today() }));
      }
      return { ...s, [n]: next };
    });
  };

  const reset = () => {
    setStatuses(seed());
    setShipLog({});
  };

  const streak = computeStreak(Object.values(shipLog));
  // next issue to work: first in sequence not shipped
  const nextIssue =
    issues.find((i) => statuses[i.n] !== "shipped") ?? null;

  return { statuses, shipLog, cycle, reset, ready, streak, nextIssue };
}
