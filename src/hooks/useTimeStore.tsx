import { create } from 'zustand'
import { fetchTimeEntries } from '../services/apiService'
import type { TimeStore } from '../types/TimeStore'

export const useTimeStore = create<TimeStore>((set, get) => ({
  entries: [],
  filterStart: new Date(),
  filterEnd: new Date(),

  refreshEntries: async (newStart?: Date, newEnd?: Date): Promise<void> => {
    const start = newStart ?? get().filterStart
    const end = newEnd ?? get().filterEnd

    try {
      const data = await fetchTimeEntries(start, end, 1)

      set({
        entries: data,
        filterStart: start,
        filterEnd: end,
      })
    } catch (error) {
      console.error('Error fetching time entries:', error)
    }
  },
}))
