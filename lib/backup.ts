"use client";

// All localStorage keys the app owns.
const KEYS = [
  "znb.statuses.v1",
  "znb.shiplog.v1",
  "znb.drafts.v1",
  "znb.notes.v1",
];

interface Backup {
  app: "zabalnewsletterbuilder";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function exportState(): Backup {
  const data: Record<string, unknown> = {};
  for (const k of KEYS) {
    const raw = localStorage.getItem(k);
    if (raw) {
      try {
        data[k] = JSON.parse(raw);
      } catch {
        // skip malformed
      }
    }
  }
  return {
    app: "zabalnewsletterbuilder",
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function downloadBackup() {
  const blob = new Blob([JSON.stringify(exportState(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zao-newsletter-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Returns a status message; caller reloads on success to rehydrate hooks.
export function importState(text: string): { ok: boolean; msg: string } {
  let parsed: Backup;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, msg: "not valid JSON" };
  }
  if (parsed?.app !== "zabalnewsletterbuilder" || !parsed.data) {
    return { ok: false, msg: "not a newsletter backup file" };
  }
  let n = 0;
  for (const k of KEYS) {
    if (parsed.data[k] !== undefined) {
      localStorage.setItem(k, JSON.stringify(parsed.data[k]));
      n++;
    }
  }
  return { ok: true, msg: `restored ${n} sections` };
}
