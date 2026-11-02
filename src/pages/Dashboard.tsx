
import { useEffect, useState } from 'react';
import MoneySection from '../components/MoneySection';
import type {
  MonthlyData,
  MonthlyRecords,
  SectionKey,
  Transaction,
} from '../types/expense';
import {
  loadMonthlyData,
  saveMonthlyData,
} from '../utils/storage';

const createEmptyMonth = (): MonthlyData => ({
  personalExpenses: [],
  maramMoney: [],
});

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`;
  });

  const [monthlyRecords, setMonthlyRecords] =
    useState<MonthlyRecords>(loadMonthlyData);

  // Save data whenever it changes
  useEffect(() => {
    saveMonthlyData(monthlyRecords);
  }, [monthlyRecords]);

  const currentMonth =
    monthlyRecords[selectedMonth] ?? createEmptyMonth();

  // Format selected month
  const monthLabel = new Date(
    `${selectedMonth}-01T00:00:00`
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Change month
  const changeMonth = (direction: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);

    const newDate = new Date(year, month - 1 + direction, 1);

    const newMonth = `${newDate.getFullYear()}-${String(
      newDate.getMonth() + 1
    ).padStart(2, '0')}`;

    setSelectedMonth(newMonth);
  };

  // Update transactions
  const updateTransactions = (
    section: SectionKey,
    updater: (transactions: Transaction[]) => Transaction[]
  ) => {
    setMonthlyRecords((previousRecords) => {
      const monthData =
        previousRecords[selectedMonth] ?? createEmptyMonth();

      return {
        ...previousRecords,
        [selectedMonth]: {
          ...monthData,
          [section]: updater(monthData[section]),
        },
      };
    });
  };

  // Add transaction
  const addTransaction = (
    section: SectionKey,
    amount: number,
    note: string
  ) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      note,
    };

    updateTransactions(section, (transactions) => [
      ...transactions,
      newTransaction,
    ]);
  };

  // Delete transaction
  const deleteTransaction = (
    section: SectionKey,
    id: string
  ) => {
    updateTransactions(section, (transactions) =>
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  // Edit transaction
  const editTransaction = (
    section: SectionKey,
    id: string,
    amount: number,
    note: string
  ) => {
    updateTransactions(section, (transactions) =>
      transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, amount, note }
          : transaction
      )
    );
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-8 sm:py-12">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-10 text-center">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Personal Finance Journal
          </p>

          <h1 className="font-display text-4xl font-semibold text-brown-dark sm:text-5xl">
            Monthly Expenses
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
            Keep track of your monthly spending in one simple place.
          </p>

          <div className="mx-auto mt-5 h-px w-20 bg-gold" />

        </header>

        {/* Month Selector */}
        <div className="mb-8 flex items-center justify-center gap-6">

          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D9CA] bg-white text-brown transition hover:border-gold hover:bg-beige"
            aria-label="Previous month"
          >
            ←
          </button>

          <div className="min-w-40 text-center">
            <p className="text-xs uppercase tracking-widest text-muted">
              Selected Month
            </p>

            <h2 className="mt-1 font-display text-2xl font-semibold text-brown-dark">
              {monthLabel}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D9CA] bg-white text-brown transition hover:border-gold hover:bg-beige"
            aria-label="Next month"
          >
            →
          </button>

        </div>

        {/* Money Sections */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">

          <MoneySection
            title="My Expenses"
            subtitle="Your personal monthly expenses"
            variant="personal"
            transactions={currentMonth.personalExpenses}
            onAdd={(amount, note) =>
              addTransaction('personalExpenses', amount, note)
            }
            onDelete={(id) =>
              deleteTransaction('personalExpenses', id)
            }
            onUpdate={(id, amount, note) =>
              editTransaction('personalExpenses', id, amount, note)
            }
          />

          <MoneySection
            title="Maram's Money"
            subtitle="Money owed to Maram"
            variant="maram"
            transactions={currentMonth.maramMoney}
            onAdd={(amount, note) =>
              addTransaction('maramMoney', amount, note)
            }
            onDelete={(id) =>
              deleteTransaction('maramMoney', id)
            }
            onUpdate={(id, amount, note) =>
              editTransaction('maramMoney', id, amount, note)
            }
          />

        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="font-display text-sm italic text-muted">
            A little more organized, every month.
          </p>
          <p className="mt-2 text-xs text-[#B6A797]">
            Personal use only · Monthly Expenses Tracker
          </p>
        </footer>

      </div>
    </main>
  );
}

export default Dashboard;
