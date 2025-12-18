import { create } from 'zustand'
import { fetchTimeEntries, deleteTimeEntry } from '../services/apiService'
import type { TimeStore } from '../types/TimeStore'

export const useTimeStore = create<TimeStore>((set, get) => ({
  entries: [],
  currentClockIn: null,
  filterStart: new Date(),
  filterEnd: new Date(),

  setCurrentClockIn: async (clockIn: Date) => {
    set({currentClockIn: clockIn});
  },

  refreshEntries: async (newStart?: Date, newEnd?: Date): Promise<void> => {
    const start = newStart ?? get().filterStart
    const end = newEnd ?? get().filterEnd

    try {
      const data = await fetchTimeEntries(start, end, 1)

      const mappedData = data.map((entry) => {
        const clockIn = new Date(entry.startDate)
        const clockOut = entry.endDate ? new Date(entry.endDate) : null

        const durationMinutes =
          clockOut
            ? Math.floor((clockOut.getTime() - clockIn.getTime()) / 60000)
            : 0

        return {
          ...entry,
          durationMinutes,
        }
      });

      set({
        entries: mappedData,
        filterStart: start,
        filterEnd: end,
      })
    } catch (error) {
      console.error('Error fetching time entries:', error)
    }
  },

  deleteEntry: async (entryId: number) => {
    try {
      await deleteTimeEntry(entryId)

      set((state) => ({
        entries: state.entries.filter((e) => e.id !== entryId),
      }))
    } catch (error) {
      console.error('Error deleting time entry:', error)
    }
  }
}));
