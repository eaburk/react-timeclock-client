import { create } from 'zustand';
import { fetchCompanies, deleteCompany, createCompany } from '../services';
import type { CompanyStore, Company } from '../types';

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  companies: [],
  activeCompany: null,

  setActiveCompany: async (company: Company) => {
    set(state => {
      const newCompany = state.companies.find(c => c.id == company.id);
      return {
        activeCompany: newCompany
      }
    });
  },

  createNewCompany: async (company: Company) => {
    try {
      const data = await createCompany(company);

      set((state) => ({
        companies: [...state.companies, data],
      }));
    } catch (error) {
      console.error('Error creating company', error);
    }
  },

  refreshCompanies: async (): Promise<void> => {
    try {
      const companies = await fetchCompanies();

      set({
        companies: companies
      });
    } catch (error) {
      console.error('Error fetching companies', error);
    }
  },

  deleteCompany: async (companyId: number): Promise<void> => {
    try {
      await deleteCompany(companyId);

      set((state) => ({
        companies: state.companies.filter((e) => e.id !== companyId),
      }));
    } catch (error) {
      console.error('Error deleting company', error);
    }
  }
}));

