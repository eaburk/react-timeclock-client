import { create } from 'zustand';
import { fetchTimeEntries } from '../services';
import type { TimeReportStore } from '../types';
import { useCompanyStore } from './useCompanyStore';

// Helper to get the current month's bounds
const getCurrentMonthBounds = () => {
  const now = new Date();
  // First day of current month: YYYY-MM-01 at 00:00:00
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  // Last day of current month: Day 0 of the next month gives the last day of this month
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return { start, end };
};

export const useTimeReportStore = create<TimeReportStore>((set, get) => {
  const bounds = getCurrentMonthBounds();

  return {
    reportEntries: [],
    // Initialize directly to the current month
    reportStart: bounds.start,
    reportEnd: bounds.end,
    isReportLoading: false,

    setReportDates: (start, end) => {
      set({ reportStart: start, reportEnd: end });
    },

    refreshReportEntries: async (): Promise<void> => {
      const activeCompany = useCompanyStore.getState().activeCompany;
      if (!activeCompany) return;

      set({ isReportLoading: true });
      try {
        const { reportStart, reportEnd } = get();
        const entries = await fetchTimeEntries(reportStart, reportEnd, activeCompany.id);
        set({ reportEntries: entries });
      } catch (error) {
        console.error('Error fetching report entries:', error);
      } finally {
        set({ isReportLoading: false });
      }
    },
  };
});
