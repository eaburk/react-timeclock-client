export function minutesBetween(start: Date | null, nowMs: number): number {
  if (!start) return 0;

  return Math.max(
    0,
    Math.floor((nowMs - start.getTime()) / 60000)
  );
}

export function minutesToHoursMinutes(minutes: number) {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
}

export function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${h}h ${m}m`;
}
