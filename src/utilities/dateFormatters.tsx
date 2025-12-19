export function toYYMMDDLocal(date: Date) {
  const dateLocal = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  );

  return dateLocal.toISOString();
}
