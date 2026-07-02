// Year of the ZABAL began 2026-01-01 (ZABAL token launch). Day N = day-of-year.

export function dayOfYear(d: Date): number {
  // UTC-based so a DST change between Jan 1 and the date can't shift the count.
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const cur = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((cur - start) / 86400000);
}

export function zabalTitle(d: Date): string {
  return `Year of the ZABAL Day ${dayOfYear(d)}`;
}
