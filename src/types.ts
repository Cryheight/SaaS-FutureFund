export interface UserFinancialData {
  age: number;
  currentSavings: number;
  income: number;
  expenses: number;
  investmentReturn: number;
}

export interface Scenario {
  id: number;
  name: string;
  incomeChange: number;
  expenseChange: number;
  startAge: number;
}

export interface Debt {
  id: number;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
}

export interface HousePlan {
  id: number;
  price: number;
  downPaymentPercent: number;
  interestRate: number;
  duration: number;
}

export interface ProjectionPoint {
  age: number;
  netWorth: number;
}

export interface RetirementResult {
  retirementAge: number;
  yearsRemaining: number;
  projectedNetWorth: number;
  retirementTarget: number;
  monthlySavings: number;
  projectionData: ProjectionPoint[];
}

export interface InvestmentImpact {
  additionalMonthlyInvestment: number;
  expectedAnnualReturn: number;
  originalRetirementAge: number;
  newRetirementAge: number;
  timeSavedYears: number;
}

export interface DebtImpact {
  debt: Debt;
  monthsToPayoff: number;
  totalInterest: number;
  retirementAgeWithDebt: number;
  retirementAgeWithoutDebt: number;
  yearsDelayed: number;
}

export interface HouseImpact {
  housePlan: HousePlan;
  downPayment: number;
  monthlyMortgage: number;
  retirementAgeWithHouse: number;
  retirementAgeWithoutHouse: number;
  yearsDelayed: number;
}

export type Screen = 'dashboard' | 'retirement' | 'scenarios' | 'invest' | 'debt' | 'house' | 'settings';
