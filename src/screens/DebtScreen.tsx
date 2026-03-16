import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { InputField } from '../components/InputField';
import { Card } from '../components/Card';
import { calculateDebtImpact, debtMonthsToPayoff, debtTotalInterest, formatCurrency } from '../calculator';
import type { UserFinancialData, Debt } from '../types';

interface Props {
  userData: UserFinancialData;
  debts: Debt[];
  onAdd: (d: Omit<Debt, 'id'>) => void;
  onRemove: (id: number) => void;
}

export function DebtScreen({ userData, debts, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: 10000, interestRate: 5, monthlyPayment: 200 });

  const handleAdd = () => {
    onAdd({ ...form });
    setForm({ amount: 10000, interestRate: 5, monthlyPayment: 200 });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {debts.length === 0 && !showForm && (
        <Card className="p-6 text-center">
          <p className="text-gray-500 text-sm">No debts added yet. Add a debt to see its impact on your retirement.</p>
        </Card>
      )}

      {debts.map(debt => {
        const impact = calculateDebtImpact(userData, debt);
        const months = debtMonthsToPayoff(debt);
        const totalInterest = debtTotalInterest(debt);
        const years = Math.floor(months / 12);
        const remMonths = months % 12;
        return (
          <Card key={debt.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-gray-500 text-xs">Balance</p>
                    <p className="font-bold text-gray-900">{formatCurrency(debt.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Monthly Payment</p>
                    <p className="font-bold text-gray-900">{formatCurrency(debt.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Interest Rate</p>
                    <p className="font-bold text-gray-900">{debt.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Payoff Time</p>
                    <p className="font-bold text-gray-900">{years > 0 ? `${years}y ` : ''}{remMonths}mo</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-medium text-red-500">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retirement Delay</span>
                    <span className={`font-medium ${impact.yearsDelayed > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {impact.yearsDelayed > 0 ? `+${impact.yearsDelayed.toFixed(1)} yrs` : 'No delay'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => onRemove(debt.id)} className="text-red-400 hover:text-red-600 ml-3">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        );
      })}

      {showForm ? (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Debt</h3>
          <InputField label="Debt Amount" value={form.amount} onChange={v => setForm(p => ({ ...p, amount: parseFloat(v) || 0 }))} prefix="$" min={0} />
          <InputField label="Interest Rate" value={form.interestRate} onChange={v => setForm(p => ({ ...p, interestRate: parseFloat(v) || 0 }))} suffix="%" min={0} max={50} step={0.1} />
          <InputField label="Monthly Payment" value={form.monthlyPayment} onChange={v => setForm(p => ({ ...p, monthlyPayment: parseFloat(v) || 0 }))} prefix="$" min={0} />
          <div className="flex gap-2 mt-2">
            <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add Debt</button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 text-indigo-600 py-3 rounded-xl text-sm font-medium hover:bg-indigo-50"
        >
          <Plus size={16} /> Add Debt
        </button>
      )}
    </div>
  );
}
