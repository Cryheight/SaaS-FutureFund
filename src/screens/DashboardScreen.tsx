import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { calculateRetirement, savingsRate, formatCurrency, formatPercentage, retirementTarget } from '../calculator';
import type { UserFinancialData, Scenario } from '../types';

interface Props {
  userData: UserFinancialData;
  scenarios: Scenario[];
}

export function DashboardScreen({ userData, scenarios }: Props) {
  const result = calculateRetirement(userData, scenarios);
  const rate = savingsRate(userData);
  const target = retirementTarget(userData);

  const rateColor = rate >= 50 ? '#10b981' : rate >= 20 ? '#6366f1' : '#f59e0b';

  const chartData = result.projectionData.map(p => ({
    age: p.age,
    netWorth: Math.round(p.netWorth),
    target: Math.round(target),
  }));

  return (
    <div className="space-y-4">
      <Card highlight className="p-6 text-center">
        <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Estimated Retirement Age</p>
        <p className="text-7xl font-bold text-white my-2">{result.retirementAge}</p>
        <p className="text-indigo-200 text-sm">{result.yearsRemaining.toFixed(1)} years remaining</p>
      </Card>

      <div className="flex gap-3">
        <StatCard title="Current Savings" value={formatCurrency(userData.currentSavings)} />
        <StatCard title="Monthly Savings" value={formatCurrency(result.monthlySavings)} />
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Savings Rate</span>
          <span className="text-sm font-bold" style={{ color: rateColor }}>{formatPercentage(rate)}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(rate, 100)}%`, backgroundColor: rateColor }}
          />
        </div>
      </Card>

      {chartData.length > 1 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-indigo-600 mb-4">Net Worth Projection</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" tick={{ fontSize: 10 }} label={{ value: 'Age', position: 'insideBottom', offset: -2, fontSize: 10 }} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} width={50} />
              <Tooltip formatter={(v: number, name: string) => [formatCurrency(v), name === 'netWorth' ? 'Net Worth' : 'Target']} labelFormatter={l => `Age ${l}`} />
              <ReferenceLine y={target} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Target', fontSize: 10, fill: '#10b981' }} />
              <Area type="monotone" dataKey="netWorth" stroke="#6366f1" fill="url(#netWorthGradient)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Age {userData.age}</span>
            <span>Age {result.retirementAge}</span>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Retirement Target</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target Amount (25x Annual Expenses)</span>
            <span className="font-bold text-indigo-600">{formatCurrency(result.retirementTarget)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Projected Net Worth at Retirement</span>
            <span className="font-medium">{formatCurrency(result.projectedNetWorth)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
