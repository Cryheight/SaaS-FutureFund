import { useState, useCallback } from 'react';
import type { UserFinancialData, Scenario, Debt, HousePlan } from './types';

const STORAGE_KEY = 'futurefund_data';

interface AppState {
  userData: UserFinancialData;
  scenarios: Scenario[];
  debts: Debt[];
  housePlans: HousePlan[];
}

const defaultData: AppState = {
  userData: {
    age: 30,
    currentSavings: 50000,
    income: 5000,
    expenses: 3500,
    investmentReturn: 7,
  },
  scenarios: [],
  debts: [],
  housePlans: [],
};

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultData, ...JSON.parse(stored) };
  } catch {}
  return defaultData;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);

  const updateUserData = useCallback((data: UserFinancialData) => {
    setState(prev => {
      const next = { ...prev, userData: data };
      saveState(next);
      return next;
    });
  }, []);

  const addScenario = useCallback((scenario: Omit<Scenario, 'id'>) => {
    setState(prev => {
      const next = {
        ...prev,
        scenarios: [...prev.scenarios, { ...scenario, id: Date.now() }],
      };
      saveState(next);
      return next;
    });
  }, []);

  const removeScenario = useCallback((id: number) => {
    setState(prev => {
      const next = { ...prev, scenarios: prev.scenarios.filter(s => s.id !== id) };
      saveState(next);
      return next;
    });
  }, []);

  const addDebt = useCallback((debt: Omit<Debt, 'id'>) => {
    setState(prev => {
      const next = { ...prev, debts: [...prev.debts, { ...debt, id: Date.now() }] };
      saveState(next);
      return next;
    });
  }, []);

  const removeDebt = useCallback((id: number) => {
    setState(prev => {
      const next = { ...prev, debts: prev.debts.filter(d => d.id !== id) };
      saveState(next);
      return next;
    });
  }, []);

  const addHousePlan = useCallback((plan: Omit<HousePlan, 'id'>) => {
    setState(prev => {
      const next = { ...prev, housePlans: [...prev.housePlans, { ...plan, id: Date.now() }] };
      saveState(next);
      return next;
    });
  }, []);

  const removeHousePlan = useCallback((id: number) => {
    setState(prev => {
      const next = { ...prev, housePlans: prev.housePlans.filter(h => h.id !== id) };
      saveState(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(defaultData);
    saveState(defaultData);
  }, []);

  return {
    ...state,
    updateUserData,
    addScenario,
    removeScenario,
    addDebt,
    removeDebt,
    addHousePlan,
    removeHousePlan,
    resetAll,
  };
}
