import type { TimeEntry } from './';

export interface TimeReportStore {
  reportEntries: TimeEntry[];
  reportStart: Date;
  reportEnd: Date;
  isReportLoading: boolean;
  setReportDates: (start: Date, end: Date) => void;
  refreshReportEntries: () => Promise<void>;
}
