import type { TimeEntry } from './TimeEntry'

export interface TimeStore {
  entries: TimeEntry[]
  filterStart: Date
  filterEnd: Date
  refreshEntries: (newStart?: Date, newEnd?: Date) => Promise<void>
}
