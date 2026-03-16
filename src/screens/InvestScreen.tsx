import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { calculateInvestmentImpact, formatCurrency } from '../calculator';
import type { UserFinancialData } from '../types';

interface Props {
  userData: UserFinancialData;
}

export function InvestScreen({ userData }: Props) {
  const [additionalInvestment, setAdditionalInvestment] = useState(500);
  const [expectedReturn, setExpectedReturn] = useState(userData.investmentReturn);

  const impact = calculateInvestmentImpact(userData, additionalInvestment, expectedReturn);
  const timeSaved = impact.timeSavedYears;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Investment Parameters</h3>
        <InputField
          label="Additional Monthly Investment"
          value={additionalInvestment}
          onChange={v => setAdditionalInvestment(parseFloat(v) || 0)}
          prefix="$"
          min={0}
        />
        <InputField
          label="Expected Annual Return"
          value={expectedReturn}
          onChange={v => setExpectedReturn(parseFloat(v) || 0)}
          suffix="%"
          min={0}
          max={30}
          step={0.5}
        />
      </Card>

      <div className="flex gap-3">
        <StatCard title="Original Retirement" value={`Age ${impact.originalRetirementAge}`} />
        <StatCard title="New Retirement" value={`Age ${impact.newRetirementAge}`} highlight />
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Impact Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Additional Monthly Investment</span>
            <span className="font-medium">{formatCurrency(additionalInvestment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Expected Return</span>
            <span className="font-medium">{expectedReturn.toFixed(1)}%</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between text-sm">
            <span className="text-gray-600">Time Saved</span>
            <span className={`font-bold ${timeSaved > 0 ? 'text-green-600' : timeSaved < 0 ? 'text-red-500' : 'text-gray-600'}`}>
              {timeSaved === 0 ? 'No change' : timeSaved > 0 ? `${timeSaved.toFixed(1)} years earlier` : `${Math.abs(timeSaved).toFixed(1)} years later`}
            </span>
          </div>
        </div>
      </Card>

      {timeSaved > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-green-700 text-sm font-medium">
            By investing an extra {formatCurrency(additionalInvestment)}/month at {expectedReturn.toFixed(1)}% return, you can retire {timeSaved.toFixed(1)} years earlier!
          </p>
        </Card>
      )}
    </div>
  );
}
