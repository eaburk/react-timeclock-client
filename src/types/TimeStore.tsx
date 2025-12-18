import type { TimeEntry } from './';
import type { DateNull } from './';

export interface TimeStore {
  entries: TimeEntry[];
  currentClockIn: DateNull;
  filterStart: Date;
  filterEnd: Date;
  refreshEntries: (newStart?: Date, newEnd?: Date) => Promise<void>;
  setCurrentClockIn: (clockIn: DateNull) => Promise<void>;
  deleteEntry: (entryId: number) => Promise<void>;
}
