import { Company } from './';
export interface TimeStore {
  companies: Company[];
  refreshCompanies: (newStart?: Date, newEnd?: Date) => Promise<void>;
  deleteCompany: (entryId: number) => Promise<void>;
  createNewCompany: (entry: TimeEntry | null) => Promise<void>;
}

