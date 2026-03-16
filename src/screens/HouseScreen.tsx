import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { InputField } from '../components/InputField';
import { Card } from '../components/Card';
import { calculateHouseImpact, houseDownPayment, houseMonthlyPayment, formatCurrency } from '../calculator';
import type { UserFinancialData, HousePlan } from '../types';

interface Props {
  userData: UserFinancialData;
  housePlans: HousePlan[];
  onAdd: (h: Omit<HousePlan, 'id'>) => void;
  onRemove: (id: number) => void;
}

export function HouseScreen({ userData, housePlans, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ price: 400000, downPaymentPercent: 20, interestRate: 6.5, duration: 30 });

  const handleAdd = () => {
    onAdd({ ...form });
    setForm({ price: 400000, downPaymentPercent: 20, interestRate: 6.5, duration: 30 });
    setShowForm(false);
  };

  const previewDown = houseDownPayment(form as HousePlan & { id: 0 });
  const previewPayment = houseMonthlyPayment(form as HousePlan & { id: 0 });

  return (
    <div className="space-y-4">
      {housePlans.length === 0 && !showForm && (
        <Card className="p-6 text-center">
          <p className="text-gray-500 text-sm">No house plans yet. Add one to see how a mortgage affects your retirement.</p>
        </Card>
      )}

      {housePlans.map(plan => {
        const impact = calculateHouseImpact(userData, plan);
        return (
          <Card key={plan.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-gray-500 text-xs">Home Price</p>
                    <p className="font-bold text-gray-900">{formatCurrency(plan.price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Down Payment</p>
                    <p className="font-bold text-gray-900">{formatCurrency(impact.downPayment)} ({plan.downPaymentPercent}%)</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Monthly Mortgage</p>
                    <p className="font-bold text-gray-900">{formatCurrency(impact.monthlyMortgage)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Loan Term</p>
                    <p className="font-bold text-gray-900">{plan.duration} years at {plan.interestRate}%</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retirement without house</span>
                    <span className="font-medium">Age {impact.retirementAgeWithoutHouse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retirement with house</span>
                    <span className="font-medium text-indigo-600">Age {impact.retirementAgeWithHouse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retirement Delay</span>
                    <span className={`font-medium ${impact.yearsDelayed > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {impact.yearsDelayed > 0 ? `+${impact.yearsDelayed.toFixed(1)} yrs` : 'No delay'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => onRemove(plan.id)} className="text-red-400 hover:text-red-600 ml-3">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        );
      })}

      {showForm ? (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add House Plan</h3>
          <InputField label="Home Price" value={form.price} onChange={v => setForm(p => ({ ...p, price: parseFloat(v) || 0 }))} prefix="$" min={0} />
          <InputField label="Down Payment" value={form.downPaymentPercent} onChange={v => setForm(p => ({ ...p, downPaymentPercent: parseFloat(v) || 0 }))} suffix="%" min={0} max={100} step={1} />
          <InputField label="Interest Rate" value={form.interestRate} onChange={v => setForm(p => ({ ...p, interestRate: parseFloat(v) || 0 }))} suffix="%" min={0} max={30} step={0.1} />
          <InputField label="Loan Term" value={form.duration} onChange={v => setForm(p => ({ ...p, duration: parseInt(v) || 30 }))} suffix="years" min={5} max={40} step={5} />
          {form.price > 0 && (
            <div className="bg-indigo-50 rounded-lg p-3 mb-3 text-sm">
              <p className="text-indigo-700">Down payment: <strong>{formatCurrency(previewDown)}</strong></p>
              <p className="text-indigo-700">Monthly mortgage: <strong>{formatCurrency(previewPayment)}</strong></p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Add Plan</button>
            <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 text-indigo-600 py-3 rounded-xl text-sm font-medium hover:bg-indigo-50"
        >
          <Plus size={16} /> Add House Plan
        </button>
      )}
    </div>
  );
}
