import React, { useState } from 'react';
import { Card } from '../components/Card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  onReset: () => void;
}

export function SettingsScreen({ onReset }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">About FutureFund</h3>
        <p className="text-sm text-gray-600">Version 1.0</p>
        <p className="text-xs text-gray-500 mt-2">
          A retirement and financial scenario planning tool. All calculations are performed locally — no data is sent to any server.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">How It Works</h3>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside mt-2">
          <li>Retirement target = 25x your annual expenses (FIRE rule)</li>
          <li>Month-by-month simulation of net worth growth</li>
          <li>Investment returns compound monthly</li>
          <li>Scenarios apply income/expense changes at specified ages</li>
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Data Management</h3>
        <p className="text-xs text-gray-500 mb-3">Your data is stored locally in your browser. Clearing it will reset all financial data, scenarios, debts, and house plans.</p>
        {confirmReset && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700">This will permanently delete all your data. Are you sure?</p>
          </div>
        )}
        <button
          onClick={handleReset}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${confirmReset ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}`}
        >
          {confirmReset ? 'Confirm Reset All Data' : 'Reset All Data'}
        </button>
        {confirmReset && (
          <button onClick={() => setConfirmReset(false)} className="w-full mt-2 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            Cancel
          </button>
        )}
      </Card>
    </div>
  );
}
