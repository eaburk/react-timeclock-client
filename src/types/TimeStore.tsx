import type { TimeEntry } from './';

export interface TimeStore {
  entries: TimeEntry[];
  activeEntry: TimeEntry | null;
  filterStart: Date;
  filterEnd: Date;
  refreshEntries: (newStart?: Date, newEnd?: Date) => Promise<void>;
  deleteEntry: (entryId: number) => Promise<void>;
  setActiveEntry: (entry: TimeEntry | null) => Promise<void>;
  updateEntry: (entry: TimeEntry | null) => Promise<void>;
}
