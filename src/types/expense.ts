export interface ExpenseEntry {
  id: string
  amount: number
  note: string
}

export interface MonthlyData {
  personalExpenses: ExpenseEntry[]
  maramMoney: ExpenseEntry[]
}