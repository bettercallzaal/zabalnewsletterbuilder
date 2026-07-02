// Year of the ZABAL began 2026-01-01 (ZABAL token launch). Day N = day-of-year.

export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function zabalTitle(d: Date): string {
  return `Year of the ZABAL Day ${dayOfYear(d)}`;
}
