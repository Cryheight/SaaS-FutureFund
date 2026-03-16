import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { InputField } from '../components/InputField';
import { Card } from '../components/Card';
import { calculateRetirement, formatCurrency } from '../calculator';
import type { UserFinancialData, Scenario } from '../types';

interface Props {
  userData: UserFinancialData;
  scenarios: Scenario[];
  onAdd: (s: Omit<Scenario, 'id'>) => void;
  onRemove: (id: number) => void;
}

export function ScenariosScreen({ userData, scenarios, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', incomeChange: 0, expenseChange: 0, startAge: userData.age });

  const baseResult = calculateRetirement(userData);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form });
    setForm({ name: '', incomeChange: 0, expenseChange: 0, startAge: userData.age });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-semibold text-gray-700">Base Plan</h3>
        </div>
        <p className="text-sm text-gray-600">Retirement Age: <span className="font-bold text-indigo-600">{baseResult.retirementAge}</span></p>
        <p className="text-sm text-gray-600">Target: <span className="font-medium">{formatCurrency(baseResult.retirementTarget)}</span></p>
      </Card>

      {scenarios.map(scenario => {
        const scenResult = calculateRetirement(userData, [scenario]);
        const diff = scenResult.retirementAge - baseResult.retirementAge;
        return (
          <Card key={scenario.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">Starts at age {scenario.startAge}</p>
                <div className="mt-2 space-y-1">
                  {scenario.incomeChange !== 0 && (
                    <p className="text-xs text-gray-600">Income: <span className={scenario.incomeChange > 0 ? 'text-green-600' : 'text-red-500'}>{scenario.incomeChange > 0 ? '+' : ''}{formatCurrency(scenario.incomeChange)}/mo</span></p>
                  )}
                  {scenario.expenseChange !== 0 && (
                    <p className="text-xs text-gray-600">Expenses: <span className={scenario.expenseChange < 0 ? 'text-green-600' : 'text-red-500'}>{scenario.expenseChange > 0 ? '+' : ''}{formatCurrency(scenario.expenseChange)}/mo</span></p>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm">Retirement Age: <span className="font-bold text-indigo-600">{scenResult.retirementAge}</span></p>
                  <p className={`text-xs ${diff <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {diff === 0 ? 'No change' : diff > 0 ? `+${diff} years later` : `${Math.abs(diff)} years earlier`}
                  </p>
                </div>
              </div>
              <button onClick={() => onRemove(scenario.id)} className="text-red-400 hover:text-red-600 ml-3 mt-1">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        );
      })}

      {showForm ? (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">New Scenario</h3>
          <InputField label="Scenario Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} type="text" placeholder="e.g., Promotion, New Baby" />
          <InputField label="Income Change" value={form.incomeChange} onChange={v => setForm(p => ({ ...p, incomeChange: parseFloat(v) || 0 }))} prefix="$" />
          <InputField label="Expense Change" value={form.expenseChange} onChange={v => setForm(p => ({ ...p, expenseChange: parseFloat(v) || 0 }))} prefix="$" />
          <InputField label="Start Age" value={form.startAge} onChange={v => setForm(p => ({ ...p, startAge: parseInt(v) || userData.age }))} min={userData.age} max={100} />
          <div className="flex gap-2 mt-2">
            <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add</button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 text-indigo-600 py-3 rounded-xl text-sm font-medium hover:bg-indigo-50"
        >
          <Plus size={16} /> Add Scenario
        </button>
      )}
    </div>
  );
}
