# Debtonator - Design Document

## Overview

Debtonator is a privacy-first PWA for tracking and paying off multiple debts using the snowball or avalanche method. Users enter their debts once and immediately see a projected payoff timeline. The app works fully offline with optional cloud sync planned for future versions.

## Technology Stack

- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (global) + React Query (async data)
- **Storage:** IndexedDB via Dexie.js
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library + Playwright
- **PWA:** vite-plugin-pwa with Workbox

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   UI Layer                       │
│  React Components + shadcn/ui + Tailwind        │
├─────────────────────────────────────────────────┤
│                 State Layer                      │
│  Zustand (global state) + React Query (async)   │
├─────────────────────────────────────────────────┤
│              Data Repository Layer               │
│  Abstract interface (swap sync backends later)  │
├─────────────────────────────────────────────────┤
│               Storage Adapter                    │
│  Dexie.js (IndexedDB) - local first            │
│  [Future: Firebase/Supabase/Self-hosted sync]  │
└─────────────────────────────────────────────────┘
```

### Key Decisions

- **Local-first:** Data lives on device by default, no account required
- **Sync-agnostic:** Repository pattern enables future sync backends without rewrites
- **Offline-capable:** All calculations client-side, works without network
- **Cents storage:** All monetary values stored as integers to avoid float precision issues

## Data Model

```typescript
interface Debt {
  id: string;
  name: string;              // "Chase Visa", "Student Loan"
  balance: number;           // Current balance in cents
  interestRate: number;      // APR as decimal (0.185 = 18.5%)
  minimumPayment: number;    // Monthly minimum in cents
  category?: string;         // Optional: "Credit Card", "Auto", "Student"
  color?: string;            // For chart visualization
  createdAt: Date;
  updatedAt: Date;
}

interface PayoffStrategy {
  method: 'snowball' | 'avalanche';
  extraPayment: number;      // Additional monthly amount in cents
}

interface PaymentLog {
  id: string;
  debtId: string;
  amount: number;            // In cents
  date: Date;
  note?: string;
}

interface UserPreferences {
  currency: string;          // "USD", "EUR", etc.
  theme: 'light' | 'dark' | 'system';
  payday: number;            // Day of month (1-28) for reminders
}
```

## Core Screens

### 1. Dashboard (Home)
- Total debt remaining (big, prominent number)
- Debt-free date with countdown
- Progress ring showing % paid off
- Payoff timeline chart (stacked area showing balance over time)
- Quick stats: total interest saved, monthly payment total

### 2. Debts List
- Cards for each debt showing name, balance, rate, minimum
- Sorted by payoff strategy order
- FAB to add new debt
- Visual indicator for focus debt (where extra payments go)

### 3. Debt Detail (modal)
- Edit debt information
- View projected payoff date for this debt
- Optional payment history log

### 4. Settings
- Toggle snowball/avalanche method
- Set extra monthly payment amount
- Currency and theme preferences
- Export data (Tier 2)

## Payoff Calculation Engine

### Snowball Method
1. Sort debts by balance (lowest first)
2. Pay minimums on all debts
3. Apply extra payment to smallest balance
4. When paid off, roll payment to next smallest

### Avalanche Method
1. Sort debts by interest rate (highest first)
2. Pay minimums on all debts
3. Apply extra payment to highest-rate debt
4. When paid off, roll payment to next highest rate

### Output Structure

```typescript
interface PayoffProjection {
  debtFreeDate: Date;
  totalInterestPaid: number;
  totalPaid: number;
  interestSaved: number;        // vs minimum-only payments
  monthlySchedule: MonthSnapshot[];
}

interface MonthSnapshot {
  month: Date;
  debts: {
    debtId: string;
    balance: number;
    payment: number;
    interestPortion: number;
    principalPortion: number;
  }[];
  totalBalance: number;
}
```

Calculations run in a web worker for UI responsiveness.

## Visualizations

- **Payoff Timeline:** Stacked area chart, each debt a different color
- **Progress Ring:** Animated donut showing % paid off
- **Debt Comparison Bar:** Horizontal bars showing relative debt sizes
- **Method Comparison:** Side-by-side snowball vs avalanche stats

### Celebratory Moments
- Confetti when a debt is paid off
- Milestone toasts: "25% debt free!", "Halfway there!"
- Progress animations throughout

## PWA Configuration

- **Theme color:** #10B981 (emerald green)
- **Display:** standalone
- **Caching:** All static assets cached, full offline support
- **Updates:** Auto-update with toast notification

## Project Structure

```
debtonator/
├── public/
│   ├── icons/
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── charts/           # Recharts wrappers
│   │   ├── debts/            # DebtCard, DebtForm, DebtList
│   │   ├── dashboard/        # ProgressRing, PayoffTimeline
│   │   └── layout/           # Navigation, Shell, BottomTabs
│   ├── hooks/
│   │   ├── useDebts.ts
│   │   ├── usePayoffCalculator.ts
│   │   └── usePreferences.ts
│   ├── lib/
│   │   ├── db.ts             # Dexie database setup
│   │   ├── repository.ts     # Abstract data layer
│   │   ├── calculator/       # Payoff engine
│   │   └── utils.ts
│   ├── stores/
│   │   └── appStore.ts       # Zustand global state
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Debts.tsx
│   │   └── Settings.tsx
│   ├── workers/
│   │   └── calculator.worker.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Testing Strategy

| Layer | Tool | Focus |
|-------|------|-------|
| Unit | Vitest | Calculator logic, utils |
| Component | React Testing Library | UI interactions, forms |
| Integration | Vitest + Dexie | Repository + IndexedDB |
| E2E | Playwright | Critical user flows |

### MVP Priority Tests
1. Snowball/avalanche calculations produce correct payoff dates
2. CRUD operations for debts persist correctly
3. Dashboard displays accurate totals
4. App works offline after first load

## Feature Tiers

### Tier 1 - MVP
- Track multiple debts (name, balance, rate, minimum payment)
- Snowball vs avalanche method toggle
- Payoff timeline visualization
- Basic dashboard with totals and progress

### Tier 2 - Valuable
- Data export (CSV/PDF)
- Categories and tags
- Weekly/monthly trend charts
- Reminder notifications

### Tier 3 - Delighters
- Cloud sync with E2E encryption
- Streak tracking and achievement badges
- Widget support
- Advanced visualizations

## Design Style

- **Visual:** Friendly & colorful (rounded corners, gradients, celebratory animations)
- **Inspiration:** Duolingo, Mint
- **Goal:** Make debt payoff feel encouraging, not depressing
