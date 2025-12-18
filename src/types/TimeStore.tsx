import type { TimeEntry } from './TimeEntry';
import type { DateValue } from './dataTypes';

export interface TimeStore {
  entries: TimeEntry[];
  currentClockIn: DateValue;
  filterStart: Date;
  filterEnd: Date;
  refreshEntries: (newStart?: Date, newEnd?: Date) => Promise<void>;
  setCurrentClockIn: (clockIn: DateValue) => Promise<void>;
  deleteEntry: (entryId: number) => Promise<void>;
}
