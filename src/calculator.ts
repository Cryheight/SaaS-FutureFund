import type { UserFinancialData, Scenario, Debt, HousePlan, ProjectionPoint, RetirementResult, InvestmentImpact, DebtImpact, HouseImpact } from './types';

export function monthlySavings(data: UserFinancialData): number {
  return data.income - data.expenses;
}

export function savingsRate(data: UserFinancialData): number {
  return data.income > 0 ? (monthlySavings(data) / data.income) * 100 : 0;
}

export function annualExpenses(data: UserFinancialData): number {
  return data.expenses * 12;
}

export function retirementTarget(data: UserFinancialData): number {
  return annualExpenses(data) * 25;
}

function applyScenarios(data: UserFinancialData, scenarios: Scenario[], currentAge: number): UserFinancialData {
  let result = { ...data };
  for (const scenario of scenarios) {
    if (currentAge >= scenario.startAge) {
      result = {
        ...result,
        income: result.income + scenario.incomeChange,
        expenses: result.expenses + scenario.expenseChange,
      };
    }
  }
  return result;
}

export function calculateRetirement(
  data: UserFinancialData,
  scenarios: Scenario[] = [],
  additionalDebtPayment: number = 0,
  additionalMortgagePayment: number = 0
): RetirementResult {
  const baseMonthlySavings = monthlySavings(data) - additionalDebtPayment - additionalMortgagePayment;
  const target = retirementTarget(data);
  const monthlyReturn = data.investmentReturn / 100 / 12;

  let currentNetWorth = data.currentSavings;
  let currentAge = data.age;
  const projectionData: ProjectionPoint[] = [];

  projectionData.push({ age: currentAge, netWorth: currentNetWorth });

  let months = 0;
  const maxMonths = (100 - data.age) * 12;

  while (currentNetWorth < target && months < maxMonths) {
    months++;
    const effectiveData = applyScenarios(data, scenarios, currentAge);
    const effectiveMonthlySavings = monthlySavings(effectiveData) - additionalDebtPayment - additionalMortgagePayment;

    let newNetWorth = currentNetWorth + effectiveMonthlySavings;
    if (monthlyReturn > 0) {
      newNetWorth *= (1 + monthlyReturn);
    }
    currentNetWorth = newNetWorth;

    const newAge = data.age + Math.floor(months / 12);
    if (newAge > currentAge) {
      currentAge = newAge;
      projectionData.push({ age: currentAge, netWorth: currentNetWorth });
    }
  }

  if (projectionData[projectionData.length - 1]?.age !== currentAge) {
    projectionData.push({ age: currentAge, netWorth: currentNetWorth });
  }

  const retirementAge = data.age + Math.floor(months / 12);
  const yearsRemaining = months / 12;

  return {
    retirementAge,
    yearsRemaining,
    projectedNetWorth: currentNetWorth,
    retirementTarget: target,
    monthlySavings: baseMonthlySavings,
    projectionData,
  };
}

export function calculateInvestmentImpact(
  data: UserFinancialData,
  additionalInvestment: number,
  expectedReturn: number
): InvestmentImpact {
  const originalResult = calculateRetirement(data);
  const newData = { ...data, income: data.income + additionalInvestment, investmentReturn: expectedReturn };
  const newResult = calculateRetirement(newData);
  const timeSaved = (originalResult.retirementAge - newResult.retirementAge) +
    (originalResult.yearsRemaining - newResult.yearsRemaining);

  return {
    additionalMonthlyInvestment: additionalInvestment,
    expectedAnnualReturn: expectedReturn,
    originalRetirementAge: originalResult.retirementAge,
    newRetirementAge: newResult.retirementAge,
    timeSavedYears: timeSaved,
  };
}

export function debtMonthsToPayoff(debt: Debt): number {
  if (debt.amount <= 0) return 0;
  if (debt.monthlyPayment <= 0) return Number.MAX_SAFE_INTEGER;
  if (debt.interestRate <= 0) return Math.ceil(debt.amount / debt.monthlyPayment);
  const monthlyRate = debt.interestRate / 100 / 12;
  const numerator = Math.log(debt.monthlyPayment / (debt.monthlyPayment - debt.amount * monthlyRate));
  const denominator = Math.log(1 + monthlyRate);
  return Math.ceil(numerator / denominator);
}

export function debtTotalInterest(debt: Debt): number {
  const months = debtMonthsToPayoff(debt);
  if (months === Number.MAX_SAFE_INTEGER) return Infinity;
  return debt.monthlyPayment * months - debt.amount;
}

export function calculateDebtImpact(data: UserFinancialData, debt: Debt): DebtImpact {
  const withoutDebtResult = calculateRetirement(data);
  const withDebtResult = calculateRetirement(data, [], debt.monthlyPayment);
  const yearsDelayed = (withDebtResult.retirementAge - withoutDebtResult.retirementAge) +
    (withDebtResult.yearsRemaining - withoutDebtResult.yearsRemaining);

  return {
    debt,
    monthsToPayoff: debtMonthsToPayoff(debt),
    totalInterest: debtTotalInterest(debt),
    retirementAgeWithDebt: withDebtResult.retirementAge,
    retirementAgeWithoutDebt: withoutDebtResult.retirementAge,
    yearsDelayed,
  };
}

export function houseDownPayment(house: HousePlan): number {
  return house.price * (house.downPaymentPercent / 100);
}

export function houseLoanAmount(house: HousePlan): number {
  return house.price - houseDownPayment(house);
}

export function houseMonthlyPayment(house: HousePlan): number {
  const principal = houseLoanAmount(house);
  if (principal <= 0) return 0;
  if (house.interestRate <= 0) return principal / (house.duration * 12);
  const monthlyRate = house.interestRate / 100 / 12;
  const numPayments = house.duration * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export function calculateHouseImpact(data: UserFinancialData, house: HousePlan): HouseImpact {
  const downPayment = houseDownPayment(house);
  const monthlyMortgage = houseMonthlyPayment(house);
  const withoutHouseResult = calculateRetirement(data);
  const withHouseData: UserFinancialData = {
    ...data,
    currentSavings: Math.max(0, data.currentSavings - downPayment),
    expenses: data.expenses + monthlyMortgage,
  };
  const withHouseResult = calculateRetirement(withHouseData);
  const yearsDelayed = (withHouseResult.retirementAge - withoutHouseResult.retirementAge) +
    (withHouseResult.yearsRemaining - withoutHouseResult.yearsRemaining);

  return {
    housePlan: house,
    downPayment,
    monthlyMortgage,
    retirementAgeWithHouse: withHouseResult.retirementAge,
    retirementAgeWithoutHouse: withoutHouseResult.retirementAge,
    yearsDelayed,
  };
}

export function formatCurrency(amount: number): string {
  if (!isFinite(amount)) return 'N/A';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${amount.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
