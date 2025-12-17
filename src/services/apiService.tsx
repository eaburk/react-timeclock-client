import type { Company } from '../types/Company';
import type { TimeEntry } from '../types/TimeEntry';

const API_BASE_URL = 'http://192.168.68.94:5000/api';

export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await fetch(`${API_BASE_URL}/companies`);

  if (!response.ok) throw new Error('Failed to fetch companies');

  const data = await response.json();

  // Convert date strings from the database into real Date objects
  return data;
};

export const fetchTimeEntries = async (startDate, endDate, company): promise<timeentry[]> => {
  if(!startDate || !endDate) {
    return;
  }
  const response = await fetch(`${API_BASE_URL}/time-entries?startDate=${startDate.toISOString().slice(0,10)}&endDate=${endDate.toISOString().slice(0,10)}&company=${company}`);

  if (!response.ok) throw new Error('Failed to fetch time entries');

  const data = await response.json();

  return data.map((entry: any) => ({
    ...entry,
    start: new Date(entry.startDate),
    end: new Date(entry.endDate),
  }));
};

export const saveTimeEntry = async (payload: any): promise<timeentry[]> => {
  const response = await fetch(`${API_BASE_URL}/time-entries`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json', 
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Failed to fetch time entries');

  return response.json();
};
