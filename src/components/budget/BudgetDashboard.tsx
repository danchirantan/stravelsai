import React, { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  Sparkles,
  Plus,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Users,
  AlertCircle
} from 'lucide-react';
import { MOCK_EXPENSES } from '../../data/mockData';
import { Expense, Trip } from '../../types/travel';
import { DailySpendChart } from './DailySpendChart';
import { GeographicalSpendHeatmap } from './GeographicalSpendHeatmap';

interface BudgetDashboardProps {
  trip: Trip;
  theme: 'dark' | 'light';
  currency: string;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  trip,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // New expense form
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<Expense['category']>('Food');
  const [newCity, setNewCity] = useState<string>(trip.destinations?.[0] || 'Jaipur');
  const [newPaidBy, setNewPaidBy] = useState('Chirantan');
  const [newStatus, setNewStatus] = useState<'Actual' | 'Estimated'>('Actual');

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetCeiling = trip.budgetTotal;
  const remainingBudget = budgetCeiling - totalSpent;
  const percentUsed = Math.min(Math.round((totalSpent / budgetCeiling) * 100), 100);

  // Breakdown by category
  const categories: Expense['category'][] = [
    'Flights',
    'Hotels',
    'Transport',
    'Food',
    'Activities',
    'Shopping',
    'Other',
  ];

  const categoryTotals = categories.map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { category: cat, total };
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category: newCategory,
      title: newTitle,
      amount: Number(newAmount),
      currency: currency || 'INR',
      paidBy: newPaidBy,
      date: new Date().toISOString().split('T')[0],
      status: newStatus,
      city: newCity || trip.destinations?.[0] || 'Jaipur',
    };

    setExpenses([newExp, ...expenses]);
    setNewTitle('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Filtered expenses based on geographical heatmap selection
  const displayedExpenses = selectedCity
    ? expenses.filter((e) => {
        const lower = selectedCity.toLowerCase();
        if (e.city && e.city.toLowerCase().includes(lower)) return true;
        if (e.title && e.title.toLowerCase().includes(lower)) return true;
        return false;
      })
    : expenses;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>FINANCIAL INTELLIGENCE & TRACKING</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
            Budget Intelligence
          </h1>
          <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-xl">
            Live audit of estimated vs settled costs across travelers, flight vouchers, and dining allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <span className="text-xs font-mono-num uppercase tracking-wider text-stone-400 block mb-1">
            Total Allocated Ceiling
          </span>
          <span className="font-editorial text-3xl md:text-4xl font-bold font-mono-num text-white">
            ₹{budgetCeiling.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-stone-400 block mt-1">
            For 2 Travelers · 7 Days Overall
          </span>
        </div>

        <div
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <span className="text-xs font-mono-num uppercase tracking-wider text-stone-400 block mb-1">
            Current Settled & Estimated
          </span>
          <span className="font-editorial text-3xl md:text-4xl font-bold font-mono-num text-emerald-400">
            ₹{totalSpent.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-stone-400 block mt-1 font-mono-num">
            {percentUsed}% of target ceiling used
          </span>
        </div>

        <div
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <span className="text-xs font-mono-num uppercase tracking-wider text-stone-400 block mb-1">
            Surplus Contingency
          </span>
          <span className="font-editorial text-3xl md:text-4xl font-bold font-mono-num text-teal-300">
            ₹{remainingBudget.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-400 block mt-1 font-mono-num">
            ✓ ₹15,500 Under Target Ceiling
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`p-6 rounded-2xl border space-y-3 ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-mono-num">
          <span className="font-semibold text-stone-300">Budget Progress</span>
          <span className="text-emerald-400 font-bold">{percentUsed}% Committed</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        {/* AI Insight Box */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3 mt-4">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs text-stone-300">
            <span className="font-semibold text-emerald-300 block font-mono-num">
              TripMind Financial Optimization
            </span>
            <p className="leading-relaxed font-sans-ui">
              {remainingBudget >= 0
                ? `You are currently ₹${remainingBudget.toLocaleString('en-IN')} under your target ceiling of ₹${budgetCeiling.toLocaleString('en-IN')}. Your allocated budget covers verified stays, dining, and activities across ${trip.destinations?.join(', ') || 'your itinerary'}.`
                : `Budget variance alert: You have exceeded target ceiling by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}. Check high-cost destination hubs below to balance allocations.`}
            </p>
          </div>
        </div>
      </div>

      {/* Geographical Spending Intensity Heatmap */}
      <GeographicalSpendHeatmap
        trip={trip}
        expenses={expenses}
        theme={theme}
        currency={currency}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />

      {/* D3 Vector Daily Projected Spend vs Actual Spend Line Chart */}
      <DailySpendChart
        trip={trip}
        expenses={expenses}
        theme={theme}
        currency={currency}
      />

      {/* Category Breakdown & Ledger Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Bar Chart List */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <h3 className="font-editorial text-xl font-bold">Category Distribution</h3>
          <div className="space-y-3">
            {categoryTotals
              .filter((c) => c.total > 0)
              .map((c) => {
                const pct = Math.round((c.total / totalSpent) * 100);
                return (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono-num">
                      <span className="text-stone-300">{c.category}</span>
                      <span className="text-stone-400 font-semibold">
                        ₹{c.total.toLocaleString('en-IN')} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Itemized Expenses Ledger */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <h3 className="font-editorial text-xl font-bold">Itemized Ledger</h3>
              {selectedCity && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono-num bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  <span>Filtered: {selectedCity}</span>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="hover:text-white cursor-pointer ml-0.5"
                    title="Clear filter"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <span className="text-[11px] text-stone-400 font-mono-num">
              Showing {displayedExpenses.length} of {expenses.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans-ui">
              <thead>
                <tr className="border-b border-white/10 text-stone-400 font-mono-num uppercase text-[10px]">
                  <th className="pb-2">Description</th>
                  <th className="pb-2">City / Hub</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Paid By</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-medium text-stone-200">{exp.title}</td>
                    <td className="py-3 text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono-num">
                        {exp.city || 'Pan-Trip'}
                      </span>
                    </td>
                    <td className="py-3 text-stone-400">{exp.category}</td>
                    <td className="py-3 text-stone-400">{exp.paidBy}</td>
                    <td className="py-3 text-right font-mono-num font-bold text-emerald-400">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#12181D] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-editorial text-xl font-bold">Record Journey Expense</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sam Sand Dunes Camel Safari Booking"
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Amount (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="3500"
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Destination City / Hub</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    {trip.destinations?.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                    <option value="Pan-Trip / General">Pan-Trip / General</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Paid By</label>
                  <select
                    value={newPaidBy}
                    onChange={(e) => setNewPaidBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="Chirantan">Chirantan</option>
                    <option value="Elena">Elena</option>
                    <option value="Split 50/50">Split 50/50</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Expense Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="Actual">Actual (Settled / Paid)</option>
                  <option value="Estimated">Estimated (Reserved)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
