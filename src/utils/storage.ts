
import type { MonthlyRecords } from '../types/expense';

const STORAGE_KEY = 'monthly-expenses-data';

export const loadMonthlyData = (): MonthlyRecords => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    return savedData ? JSON.parse(savedData) : {};
  } catch {
    return {};
  }
};

export const saveMonthlyData = (data: MonthlyRecords): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
