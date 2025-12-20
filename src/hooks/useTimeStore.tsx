import { create } from 'zustand';
import { fetchTimeEntries, deleteTimeEntry, updateTimeEntry, saveTimeEntry } from '../services';
import type { TimeStore, DateNull, TimeEntry } from '../types';

export const useTimeStore = create<TimeStore>((set, get) => ({
  entries: [],
  activeEntry: null,
  filterStart: new Date(),
  filterEnd: new Date(),

  setActiveEntry: async (timeEntry: TimeEntry | null) => {
    if(timeEntry && timeEntry.end) {
      timeEntry.durationMinutes =
        timeEntry.end
          ? Math.floor((timeEntry.end.getTime() - timeEntry.start.getTime()) / 60000)
          : 0;
    }
    set({activeEntry: timeEntry});
  },


  createEntry: async (payload: any) => {
    try {
      const entry = await saveTimeEntry(payload);

      set((state) => ({
        entries: [...state.entries, entry],
      }))
    } catch (error) {
      console.error('Error creating time entry:', error);
    }
  },

  updateEntry: async (payload: any) => {
    try {
      const data = await updateTimeEntry(payload);

      set((state) => {
        const updatedEntries = state.entries.map(e => {
          if(e.id == data.id) {
            return data;
          } else {
            return e;
          }
        });

        return {
          entries: updatedEntries,
        }
      })
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  },

  refreshEntries: async (newStart?: Date, newEnd?: Date): Promise<void> => {
    const start = newStart ?? get().filterStart;
    const end = newEnd ?? get().filterEnd;

    try {
      const entries = await fetchTimeEntries(start, end, 1);

      const mappedData = entries.map((entry) => {
        const clockIn = new Date(entry.startDate);
        const clockOut = entry.endDate ? new Date(entry.endDate) : null;

        const durationMinutes =
          clockOut
            ? Math.floor((clockOut.getTime() - clockIn.getTime()) / 60000)
            : 0;

        return {
          ...entry,
          durationMinutes,
        }
      });

      set({
        entries: mappedData,
        filterStart: start,
        filterEnd: end,
      });
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  },

  deleteEntry: async (entryId: number): Promise<void> => {
    try {
      await deleteTimeEntry(entryId);

      set((state) => ({
        entries: state.entries.filter((e) => e.id !== entryId),
      }));
    } catch (error) {
      console.error('Error deleting time entry:', error);
    }
  },

  createEntry: async (entry: TimeEntry): Promise<void> => {
    try {
      const data = await saveTimeEntry(entry);

      set((state) => ({
        entries: [...state.entries, data],
      }));
      return data;
    } catch (error) {
      console.error('Error creating entry', error);
    }
  }
}));
