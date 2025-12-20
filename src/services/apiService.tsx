import type { Company, TimeEntry } from '../types';
import { toYYMMDDLocal } from '../utilities/dateFormatters';

const API_BASE_URL = 'http://192.168.68.94:5000/api';

export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await fetch(`${API_BASE_URL}/companies`);

  if (!response.ok) throw new Error('Failed to fetch companies');

  const data = await response.json();

  return data;
};

export const createCompany = async (payload: any): Promise<Company> => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Failed to save time entries');

  const createdEntry = await response.json();

  return {
    ...createdEntry,
    start: new Date(createdEntry.startDate),
    end: '',
  }

}

export const deleteCompany = async (payload: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'DELETE',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: payload})
  });

  if (!response.ok) throw new Error('Failed to delete time entry');

  return response.json();
};

export const fetchTimeEntries = async (startDate: Date, endDate: Date, company: Number | null): Promise<TimeEntry[]> => {
  if(!startDate || !endDate) {
    return [];
  }

  const newStartDate = toYYMMDDLocal(startDate);
  const newEndDate = toYYMMDDLocal(new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1));


  const response = await fetch(`${API_BASE_URL}/time-entries?startDate=${newStartDate}&endDate=${newEndDate}&company=${company}`);

  if (!response.ok) throw new Error('Failed to fetch time entries');

  const data = await response.json();

  return data.map((entry: any) => ({
    ...entry,
    start: new Date(entry.startDate),
    end: new Date(entry.endDate),
  }));
};

export const saveTimeEntry = async (payload: any): Promise<TimeEntry> => {
  payload.startDate = new Date(payload.startDate.replace(" ", "T"));
  payload.endDate = payload.endDate ? new Date(payload.endDate.replace(" ", "T")) : "";

  const response = await fetch(`${API_BASE_URL}/time-entries`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Failed to save time entries');

  const createdEntry = await response.json();

  return {
    ...createdEntry,
    start: new Date(createdEntry.startDate),
    end: '',
  }
};

export const updateTimeEntry = async (payload: any): Promise<TimeEntry> => {
  const response = await fetch(`${API_BASE_URL}/time-entries/${payload.id}`, {
    method: 'PATCH',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Failed to update time entry');

  const createdEntry = await response.json();

  return {
    ...createdEntry,
    start: new Date(createdEntry.startDate),
    end: '',
  }
};

export const deleteTimeEntry = async (payload: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/time-entries`, {
    method: 'DELETE',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: payload})
  });

  if (!response.ok) throw new Error('Failed to delete time entry');

  return response.json();
};
