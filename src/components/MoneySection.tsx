
import { useState, type FormEvent } from 'react';
import type { Transaction } from '../types/expense';

interface MoneySectionProps {
  title: string;
  subtitle: string;
  transactions: Transaction[];
  variant: 'personal' | 'maram';
  onAdd: (amount: number, note: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, amount: number, note: string) => void;
}

function MoneySection({
  title,
  subtitle,
  transactions,
  variant,
  onAdd,
  onDelete,
  onUpdate,
}: MoneySectionProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');

  const isPersonal = variant === 'personal';

  const total = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (amount.trim() === '' || !Number.isFinite(numericAmount) || numericAmount === 0) {
      return;
    }

    onAdd(numericAmount, note.trim());

    setAmount('');
    setNote('');
  };

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditAmount(String(transaction.amount));
    setEditNote(transaction.note);
  };

  const saveEdit = (id: string) => {
    const numericAmount = Number(editAmount);

    if (
      editAmount.trim() === '' ||
      !Number.isFinite(numericAmount) ||
      numericAmount === 0
    ) {
      return;
    }

    onUpdate(id, numericAmount, editNote.trim());
    setEditingId(null);
  };

  const formatMoney = (value: number) =>
    `${value.toLocaleString('en-US')} EGP`;

  return (
    <section className="flex flex-col rounded-2xl border border-[#E9DED1] bg-white p-5 shadow-[0_4px_20px_rgba(63,48,37,0.04)] sm:p-7">

      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
            isPersonal
              ? 'bg-[#F3EDE5] text-[#6B4F3A]'
              : 'bg-[#EEE8DB] text-[#9A7947]'
          }`}
        >
          {isPersonal ? '✦' : '❋'}
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-brown-dark sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Add Transaction */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl bg-cream p-4"
      >
        <p className="mb-3 text-sm font-semibold text-brown">
          Add new transaction
        </p>

        <div className="flex flex-col gap-3">
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (e.g. 500 or -200)"
            className="w-full rounded-lg border border-[#E7DCCE] bg-white px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          />

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full rounded-lg border border-[#E7DCCE] bg-white px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-brown px-4 py-3 text-sm font-semibold text-white transition hover:bg-brown-dark"
          >
            + Add Transaction
          </button>
        </div>
      </form>

      {/* Transactions List */}
      <div className="flex-1">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-brown-dark">
            Transactions
          </h3>

          <span className="text-xs text-muted">
            {transactions.length} entries
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5D9CA] py-10 text-center">
            <p className="font-display text-lg text-muted">
              No transactions yet
            </p>
            <p className="mt-1 text-xs text-muted">
              Start by adding your first amount
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EAE3]">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="py-4"
              >
                {editingId === transaction.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="number"
                      step="any"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="rounded-lg border border-[#E7DCCE] px-3 py-2 text-sm outline-none focus:border-gold"
                    />

                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Note (optional)"
                      className="rounded-lg border border-[#E7DCCE] px-3 py-2 text-sm outline-none focus:border-gold"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(transaction.id)}
                        className="rounded-lg bg-brown px-4 py-2 text-xs text-white"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg bg-beige px-4 py-2 text-xs text-brown"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-brown-dark">
                        {transaction.note || 'No note'}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        Transaction
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.amount < 0
                            ? 'text-red-600'
                            : 'text-brown'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {formatMoney(transaction.amount)}
                      </span>

                      <button
                        type="button"
                        onClick={() => startEditing(transaction)}
                        title="Edit transaction"
                        className="text-muted transition hover:text-gold"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(transaction.id)}
                        title="Delete transaction"
                        className="text-muted transition hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mt-6 border-t border-[#E9DED1] pt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          Total Balance
        </p>

        <p className="font-display text-3xl font-semibold text-brown-dark">
          {formatMoney(total)}
        </p>
      </div>
    </section>
  );
}

export default MoneySection;
