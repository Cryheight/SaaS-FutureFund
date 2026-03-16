import React, { useState } from 'react';
import { LayoutDashboard, Calculator, GitBranch, TrendingUp, CreditCard, Home, Settings } from 'lucide-react';
import { useAppStore } from './store';
import { DashboardScreen } from './screens/DashboardScreen';
import { RetirementScreen } from './screens/RetirementScreen';
import { ScenariosScreen } from './screens/ScenariosScreen';
import { InvestScreen } from './screens/InvestScreen';
import { DebtScreen } from './screens/DebtScreen';
import { HouseScreen } from './screens/HouseScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import type { Screen } from './types';

const NAV_ITEMS: { id: Screen; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'retirement', label: 'Retire', Icon: Calculator },
  { id: 'scenarios', label: 'Scenarios', Icon: GitBranch },
  { id: 'invest', label: 'Invest', Icon: TrendingUp },
  { id: 'debt', label: 'Debt', Icon: CreditCard },
  { id: 'house', label: 'House', Icon: Home },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

const SCREEN_TITLES: Record<Screen, string> = {
  dashboard: 'Dashboard',
  retirement: 'Retirement Calculator',
  scenarios: 'Scenario Planner',
  invest: 'Investment Impact',
  debt: 'Debt Planner',
  house: 'House Calculator',
  settings: 'Settings',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const store = useAppStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen userData={store.userData} scenarios={store.scenarios} />;
      case 'retirement':
        return <RetirementScreen userData={store.userData} onSave={store.updateUserData} />;
      case 'scenarios':
        return <ScenariosScreen userData={store.userData} scenarios={store.scenarios} onAdd={store.addScenario} onRemove={store.removeScenario} />;
      case 'invest':
        return <InvestScreen userData={store.userData} />;
      case 'debt':
        return <DebtScreen userData={store.userData} debts={store.debts} onAdd={store.addDebt} onRemove={store.removeDebt} />;
      case 'house':
        return <HouseScreen userData={store.userData} housePlans={store.housePlans} onAdd={store.addHousePlan} onRemove={store.removeHousePlan} />;
      case 'settings':
        return <SettingsScreen onReset={store.resetAll} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto relative">
      <header className="bg-indigo-600 text-white px-4 py-3 flex-shrink-0 shadow-md">
        <h1 className="text-lg font-bold">FutureFund</h1>
        <p className="text-indigo-200 text-xs">{SCREEN_TITLES[currentScreen]}</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {renderScreen()}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-200 flex justify-around z-10">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = currentScreen === id;
          return (
            <button
              key={id}
              onClick={() => setCurrentScreen(id)}
              className={`flex flex-col items-center py-2 px-2 flex-1 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
