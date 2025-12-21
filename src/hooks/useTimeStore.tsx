import { create } from 'zustand';
import { fetchTimeEntries, deleteTimeEntry, updateTimeEntry, saveTimeEntry } from '../services';
import type { TimeStore, DateNull, TimeEntry, Company } from '../types';
import { useCompanyStore } from '../hooks';

export const useTimeStore = create<TimeStore>((set, get) => ({
  entries: [],
  weekEntries: [],
  activeEntry: null,
  filterStart: new Date(),
  filterEnd: new Date(),

  setActiveEntry: async (timeEntry: TimeEntry | null) => {
    set({activeEntry: timeEntry});
  },


  createEntry: async (payload: any) => {
    try {
      const entry = await saveTimeEntry(payload);
      const activeCompany = useCompanyStore.getState().activeCompany;

      await get().refreshEntries({ company: activeCompany });
      return entry;
    } catch (error) {
      console.error('Error creating time entry:', error);
    }
  },

  updateEntry: async (payload: any) => {
    try {
      const data = await updateTimeEntry(payload);
      const activeCompany = useCompanyStore.getState().activeCompany;

      await get().refreshEntries({ company: activeCompany });
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  },

  refreshEntries: async ({ newStart, newEnd, company }: { newStart?: Date, newEnd?: Date, company: Company}): Promise<void> => {
    if(!company) return;

    const start = newStart ?? get().filterStart;
    const end = newEnd ?? get().filterEnd;

    try {
      const entries = await fetchTimeEntries(start, end, company.id);

      set({
        entries: entries,
        filterStart: start,
        filterEnd: end,
      });
      await get().refreshWeekEntries({ company });
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  },

  refreshWeekEntries: async ({ company }: { company: Company }): Promise<void> => {
    if(!company) return;

    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to Sunday

    const start = startOfWeek;
    const end = endOfWeek;

    try {
      const entries = await fetchTimeEntries(start, end, company.id);

      set({
        weekEntries: entries,
      });
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  },

  deleteEntry: async (entryId: number): Promise<void> => {
    const activeCompany = useCompanyStore.getState().activeCompany;
    try {
      await deleteTimeEntry(entryId);
      await get().refreshEntries({ company: activeCompany });
    } catch (error) {
      console.error('Error deleting time entry:', error);
    }
  },
}));
