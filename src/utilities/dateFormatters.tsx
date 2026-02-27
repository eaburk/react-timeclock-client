export function toYYMMDDLocal(date: Date) {
  const dateLocal = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  );

  return dateLocal.toISOString();
}

export function toHHMM(date: Date) {
  return date.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true});
}