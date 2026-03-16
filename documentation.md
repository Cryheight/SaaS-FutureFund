# FutureFund Web App — Documentation

## Overview

FutureFund is a client-side retirement and financial scenario planning web application. It helps you estimate when you can retire and understand how financial decisions affect your timeline. All calculations run in the browser — no server, no accounts, no data collection.

Originally built as a native Android app (Kotlin/Jetpack Compose), this version is a full web port using React + TypeScript + Vite.

---

## Features

| Screen | Description |
|--------|-------------|
| Dashboard | Retirement age overview, savings stats, net worth projection chart |
| Retirement Calculator | Edit your financial details and see real-time retirement projections |
| Scenario Planner | Create life scenarios (promotion, new baby, etc.) and compare retirement ages |
| Investment Impact | See how extra monthly contributions change your retirement timeline |
| Debt Planner | Track debts, payoff dates, total interest, and retirement delay |
| House Calculator | Model a mortgage and see how it shifts your retirement age |
| Settings | App info and full data reset |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React hooks + `localStorage` |
| Deployment | Static site (no backend needed) |

---

## Project Structure

```
web/
├── index.html
├── vite.config.ts          # Dev server config (host 0.0.0.0, port 5000)
├── package.json
└── src/
    ├── main.tsx            # App entry point
    ├── App.tsx             # Root component + bottom navigation
    ├── index.css           # Tailwind CSS entry
    ├── types.ts            # All TypeScript interfaces
    ├── calculator.ts       # Financial calculation logic
    ├── store.ts            # Global state + localStorage persistence
    ├── components/
    │   ├── Card.tsx        # Base card layout component
    │   ├── StatCard.tsx    # Metric display card
    │   └── InputField.tsx  # Controlled number/text input with focus-safe editing
    └── screens/
        ├── DashboardScreen.tsx
        ├── RetirementScreen.tsx
        ├── ScenariosScreen.tsx
        ├── InvestScreen.tsx
        ├── DebtScreen.tsx
        ├── HouseScreen.tsx
        └── SettingsScreen.tsx
```

---

## Financial Logic (`src/calculator.ts`)

All formulas are ported directly from the original Android `FinancialCalculator.kt`.

### Retirement Target
```
Target = 25 × (Monthly Expenses × 12)
```
Based on the 4% safe withdrawal rate (FIRE rule).

### Month-by-Month Simulation
```
Net Worth(month+1) = (Net Worth(month) + Monthly Savings) × (1 + monthly_return)
```
Runs until net worth reaches the target or age 100.

### Debt Payoff (months)
```
n = log(payment / (payment − balance × monthly_rate)) / log(1 + monthly_rate)
```

### Mortgage Monthly Payment
```
M = P × [r(1+r)^n] / [(1+r)^n − 1]
```
Where P = principal, r = monthly rate, n = number of payments.

---

## Data Model

### UserFinancialData
| Field | Default | Description |
|-------|---------|-------------|
| age | 30 | Current age |
| currentSavings | $50,000 | Current net worth / savings |
| income | $5,000/mo | Monthly take-home income |
| expenses | $3,500/mo | Monthly expenses |
| investmentReturn | 7% | Expected annual return |

### Scenario
| Field | Description |
|-------|-------------|
| name | Descriptive name |
| incomeChange | Monthly income delta (+ or −) |
| expenseChange | Monthly expense delta (+ or −) |
| startAge | Age at which scenario kicks in |

### Debt
| Field | Description |
|-------|-------------|
| amount | Current balance |
| interestRate | Annual rate (%) |
| monthlyPayment | Fixed monthly payment |

### HousePlan
| Field | Description |
|-------|-------------|
| price | Home purchase price |
| downPaymentPercent | Down payment as % of price |
| interestRate | Mortgage annual rate (%) |
| duration | Loan term in years |

---

## State & Persistence (`src/store.ts`)

State is managed with React's `useState` hook and automatically persisted to `localStorage` under the key `futurefund_data`. It loads on startup and saves on every change. Resetting clears localStorage and restores defaults.

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm

### Steps
```bash
cd web
npm install
npm run dev
```
App runs at `http://localhost:5000`.

### Production Build
```bash
cd web
npm run build
# Output in web/dist/
```

---

## Deployment

This app is a pure static site — the built `web/dist/` folder can be served from any static host (Netlify, Vercel, GitHub Pages, S3, etc.) with no backend required.

For Replit deployment: configured as a **static** deployment with build command `cd web && npm run build` and public directory `web/dist`.

---

## Privacy

- All data stays in your browser (`localStorage`)
- No network requests are made
- No user accounts or tracking
- Clearing browser data removes all app data
