import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { calculateRetirement, formatCurrency, formatPercentage, monthlySavings, savingsRate } from '../calculator';
import type { UserFinancialData } from '../types';

interface Props {
  userData: UserFinancialData;
  onSave: (data: UserFinancialData) => void;
}

export function RetirementScreen({ userData, onSave }: Props) {
  const [form, setForm] = useState({ ...userData });
  const result = calculateRetirement(form);

  const update = (key: keyof UserFinancialData, value: string) => {
    const num = parseFloat(value) || 0;
    setForm(prev => ({ ...prev, [key]: num }));
  };

  const handleSave = () => {
    onSave(form);
  };

  const ms = monthlySavings(form);
  const sr = savingsRate(form);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Financial Details</h3>
        <InputField label="Current Age" value={form.age} onChange={v => update('age', v)} min={18} max={80} step={1} />
        <InputField label="Current Savings" value={form.currentSavings} onChange={v => update('currentSavings', v)} prefix="$" min={0} />
        <InputField label="Monthly Income" value={form.income} onChange={v => update('income', v)} prefix="$" min={0} />
        <InputField label="Monthly Expenses" value={form.expenses} onChange={v => update('expenses', v)} prefix="$" min={0} />
        <InputField label="Expected Annual Return" value={form.investmentReturn} onChange={v => update('investmentReturn', v)} suffix="%" min={0} max={30} step={0.5} />
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Save & Recalculate
        </button>
      </Card>

      <div className="flex gap-3">
        <StatCard title="Monthly Savings" value={formatCurrency(ms)} subtitle={ms < 0 ? 'Deficit!' : undefined} />
        <StatCard title="Savings Rate" value={formatPercentage(sr)} />
      </div>

      <Card highlight className="p-4 text-center">
        <p className="text-indigo-200 text-xs uppercase tracking-wide">Retirement Age</p>
        <p className="text-5xl font-bold text-white my-1">{result.retirementAge}</p>
        <p className="text-indigo-200 text-xs">{result.yearsRemaining.toFixed(1)} years away</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Summary</h3>
        <div className="space-y-2">
          {[
            ['Retirement Target', formatCurrency(result.retirementTarget)],
            ['Projected Net Worth', formatCurrency(result.projectedNetWorth)],
            ['Annual Expenses', formatCurrency(form.expenses * 12)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-600">{label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
