import { create } from 'zustand'
import { fetchTimeEntries } from '../services/apiService'

export const useTimeStore = create((set, get) => ({
  entries: [],
  filterStart: new Date(),
  filterEnd: new Date(),
  refreshEntries: async (newStart, newEnd) => {
    const start = newStart !== undefined ? newStart : get().filterStart;
    const end = newEnd !== undefined ? newEnd : get().filterEnd;
    await fetchTimeEntries(start, end)
    .then(data => {
      set({
        entries: data,
        filterStart: start,
        filterEnd: end
      });
    })
    .catch(error => {
      console.log("Error fetching time entries:", error);
    });
  },
}));

