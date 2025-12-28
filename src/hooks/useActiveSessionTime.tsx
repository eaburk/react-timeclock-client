import { useNow } from './useNow';
import { minutesBetween, minutesToHoursMinutes } from '../utilities';

export function useActiveSessionTime(
  start: Date | null,
  intervalMs = 1000
) {
  const now = useNow(intervalMs);

  const totalMinutes = minutesBetween(start, now);
  const { hours, minutes } = minutesToHoursMinutes(totalMinutes);

  return {
    totalMinutes,
    hours,
    minutes,
  };
}
