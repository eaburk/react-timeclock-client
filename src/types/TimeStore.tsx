import type { TimeEntry } from './TimeEntry'

export interface TimeStore {
  entries: TimeEntry[]
  currentClockIn: Date
  filterStart: Date
  filterEnd: Date
  refreshEntries: (newStart?: Date, newEnd?: Date) => Promise<void>
}
