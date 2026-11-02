export interface Transaction {
  id: string;
  amount: number;
  note: string;
}

export interface MonthlyData {
  personalExpenses: Transaction[];
  maramMoney: Transaction[];
}

export type MonthlyRecords = Record<string, MonthlyData>;

export type SectionKey = keyof MonthlyData;
