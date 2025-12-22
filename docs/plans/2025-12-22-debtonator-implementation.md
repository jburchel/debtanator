# Debtonator MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a privacy-first PWA for tracking debt payoff using snowball/avalanche methods with local-first storage.

**Architecture:** React + Vite PWA with IndexedDB (Dexie.js) for local storage, Zustand for global state, React Query for async data operations, and Recharts for visualizations. Repository pattern abstracts storage for future sync backends.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Dexie.js, Zustand, React Query, Recharts, Vitest, Playwright

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`

**Step 1: Initialize Vite project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```
Expected: Project files created, prompts answered with "y" to use current directory

**Step 2: Install core dependencies**

Run:
```bash
npm install
```
Expected: node_modules created, package-lock.json generated

**Step 3: Verify dev server works**

Run:
```bash
npm run dev
```
Expected: Server starts at http://localhost:5173, shows Vite + React page

**Step 4: Stop dev server and commit**

Run:
```bash
git add -A && git commit -m "feat: initialize Vite React TypeScript project"
```

---

## Task 2: Tailwind CSS Setup

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`

**Step 1: Install Tailwind and dependencies**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 2: Configure tailwind.config.js**

Replace contents of `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
  plugins: [],
}
```

**Step 3: Update src/index.css**

Replace contents:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 160 84% 39%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 160 84% 39%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 160 84% 39%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 160 84% 39%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 4: Test Tailwind works**

Update `src/App.tsx`:
```tsx
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-primary-600">Debtonator</h1>
    </div>
  )
}

export default App
```

Run: `npm run dev`
Expected: Green gradient background with "Debtonator" in green text

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Tailwind CSS with custom primary color"
```

---

## Task 3: shadcn/ui Setup

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/label.tsx`

**Step 1: Install shadcn/ui dependencies**

Run:
```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install -D @types/node
```

**Step 2: Create lib/utils.ts**

Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

export function formatPercent(decimal: number): string {
  return `${(decimal * 100).toFixed(2)}%`
}
```

**Step 3: Update vite.config.ts for path aliases**

Replace `vite.config.ts`:
```typescript
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**Step 4: Update tsconfig.json for path aliases**

Add to `tsconfig.json` compilerOptions:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 5: Create Button component**

Create `src/components/ui/button.tsx`:
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Step 6: Install Radix dependencies**

Run:
```bash
npm install @radix-ui/react-slot @radix-ui/react-label
```

**Step 7: Create Card component**

Create `src/components/ui/card.tsx`:
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Step 8: Create Input component**

Create `src/components/ui/input.tsx`:
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

**Step 9: Create Label component**

Create `src/components/ui/label.tsx`:
```tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

**Step 10: Create components index**

Create `src/components/ui/index.ts`:
```typescript
export { Button, buttonVariants } from './button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export { Input } from './input'
export { Label } from './label'
```

**Step 11: Commit**

```bash
git add -A && git commit -m "feat: add shadcn/ui base components"
```

---

## Task 4: Data Types and Validation

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/validation.ts`

**Step 1: Install Zod**

Run:
```bash
npm install zod
```

**Step 2: Create types**

Create `src/lib/types.ts`:
```typescript
export interface Debt {
  id: string
  name: string
  balance: number          // in cents
  interestRate: number     // decimal (0.185 = 18.5%)
  minimumPayment: number   // in cents
  category?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface PayoffStrategy {
  method: 'snowball' | 'avalanche'
  extraPayment: number     // in cents
}

export interface PaymentLog {
  id: string
  debtId: string
  amount: number           // in cents
  date: Date
  note?: string
}

export interface UserPreferences {
  currency: string
  theme: 'light' | 'dark' | 'system'
  payday: number           // day of month 1-28
}

export interface MonthSnapshot {
  month: Date
  debts: DebtSnapshot[]
  totalBalance: number
}

export interface DebtSnapshot {
  debtId: string
  balance: number
  payment: number
  interestPortion: number
  principalPortion: number
}

export interface PayoffProjection {
  debtFreeDate: Date
  totalInterestPaid: number
  totalPaid: number
  interestSaved: number
  monthlySchedule: MonthSnapshot[]
}
```

**Step 3: Create validation schemas**

Create `src/lib/validation.ts`:
```typescript
import { z } from 'zod'

export const debtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  balance: z.number().min(1, 'Balance must be at least $0.01'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(1, 'Interest rate cannot exceed 100%'),
  minimumPayment: z.number().min(0, 'Minimum payment cannot be negative'),
  category: z.string().optional(),
  color: z.string().optional(),
})

export const payoffStrategySchema = z.object({
  method: z.enum(['snowball', 'avalanche']),
  extraPayment: z.number().min(0),
})

export const userPreferencesSchema = z.object({
  currency: z.string().default('USD'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  payday: z.number().min(1).max(28).default(1),
})

export type DebtInput = z.infer<typeof debtSchema>
export type PayoffStrategyInput = z.infer<typeof payoffStrategySchema>
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add TypeScript types and Zod validation schemas"
```

---

## Task 5: Database Setup (Dexie.js)

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/lib/repository.ts`

**Step 1: Install Dexie**

Run:
```bash
npm install dexie
```

**Step 2: Create database**

Create `src/lib/db.ts`:
```typescript
import Dexie, { type Table } from 'dexie'
import type { Debt, PaymentLog, PayoffStrategy, UserPreferences } from './types'

export class DebtonatorDB extends Dexie {
  debts!: Table<Debt, string>
  paymentLogs!: Table<PaymentLog, string>
  settings!: Table<{ key: string; value: PayoffStrategy | UserPreferences }, string>

  constructor() {
    super('debtonator')
    this.version(1).stores({
      debts: 'id, name, createdAt',
      paymentLogs: 'id, debtId, date',
      settings: 'key',
    })
  }
}

export const db = new DebtonatorDB()
```

**Step 3: Create repository**

Create `src/lib/repository.ts`:
```typescript
import { db } from './db'
import type { Debt, PayoffStrategy, UserPreferences } from './types'

const DEFAULT_STRATEGY: PayoffStrategy = {
  method: 'avalanche',
  extraPayment: 0,
}

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  theme: 'system',
  payday: 1,
}

export const debtRepository = {
  async getAll(): Promise<Debt[]> {
    return db.debts.toArray()
  },

  async getById(id: string): Promise<Debt | undefined> {
    return db.debts.get(id)
  },

  async create(debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Debt> {
    const now = new Date()
    const newDebt: Debt = {
      ...debt,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    await db.debts.add(newDebt)
    return newDebt
  },

  async update(id: string, updates: Partial<Omit<Debt, 'id' | 'createdAt'>>): Promise<void> {
    await db.debts.update(id, { ...updates, updatedAt: new Date() })
  },

  async delete(id: string): Promise<void> {
    await db.debts.delete(id)
  },
}

export const settingsRepository = {
  async getStrategy(): Promise<PayoffStrategy> {
    const record = await db.settings.get('strategy')
    return (record?.value as PayoffStrategy) ?? DEFAULT_STRATEGY
  },

  async setStrategy(strategy: PayoffStrategy): Promise<void> {
    await db.settings.put({ key: 'strategy', value: strategy })
  },

  async getPreferences(): Promise<UserPreferences> {
    const record = await db.settings.get('preferences')
    return (record?.value as UserPreferences) ?? DEFAULT_PREFERENCES
  },

  async setPreferences(preferences: UserPreferences): Promise<void> {
    await db.settings.put({ key: 'preferences', value: preferences })
  },
}
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Dexie database and repository layer"
```

---

## Task 6: Payoff Calculator Engine

**Files:**
- Create: `src/lib/calculator.ts`
- Create: `src/lib/calculator.test.ts`

**Step 1: Install Vitest**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Step 2: Configure Vitest**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Create test setup**

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

**Step 4: Write calculator tests first (TDD)**

Create `src/lib/calculator.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { calculatePayoff, sortDebtsByMethod } from './calculator'
import type { Debt, PayoffStrategy } from './types'

const createDebt = (overrides: Partial<Debt> = {}): Debt => ({
  id: crypto.randomUUID(),
  name: 'Test Debt',
  balance: 100000, // $1000
  interestRate: 0.18, // 18%
  minimumPayment: 5000, // $50
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

describe('sortDebtsByMethod', () => {
  it('sorts by balance ascending for snowball', () => {
    const debts = [
      createDebt({ name: 'Big', balance: 500000 }),
      createDebt({ name: 'Small', balance: 100000 }),
      createDebt({ name: 'Medium', balance: 250000 }),
    ]
    const sorted = sortDebtsByMethod(debts, 'snowball')
    expect(sorted.map(d => d.name)).toEqual(['Small', 'Medium', 'Big'])
  })

  it('sorts by interest rate descending for avalanche', () => {
    const debts = [
      createDebt({ name: 'Low', interestRate: 0.05 }),
      createDebt({ name: 'High', interestRate: 0.25 }),
      createDebt({ name: 'Medium', interestRate: 0.15 }),
    ]
    const sorted = sortDebtsByMethod(debts, 'avalanche')
    expect(sorted.map(d => d.name)).toEqual(['High', 'Medium', 'Low'])
  })
})

describe('calculatePayoff', () => {
  it('returns empty projection for no debts', () => {
    const result = calculatePayoff([], { method: 'avalanche', extraPayment: 0 })
    expect(result.totalInterestPaid).toBe(0)
    expect(result.monthlySchedule).toHaveLength(0)
  })

  it('calculates payoff for single debt', () => {
    const debts = [createDebt({ balance: 100000, interestRate: 0.12, minimumPayment: 5000 })]
    const strategy: PayoffStrategy = { method: 'avalanche', extraPayment: 0 }
    const result = calculatePayoff(debts, strategy)

    expect(result.debtFreeDate).toBeInstanceOf(Date)
    expect(result.totalPaid).toBeGreaterThan(100000)
    expect(result.monthlySchedule.length).toBeGreaterThan(0)
  })

  it('pays off faster with extra payment', () => {
    const debts = [createDebt({ balance: 100000, interestRate: 0.12, minimumPayment: 5000 })]

    const withoutExtra = calculatePayoff(debts, { method: 'avalanche', extraPayment: 0 })
    const withExtra = calculatePayoff(debts, { method: 'avalanche', extraPayment: 5000 })

    expect(withExtra.monthlySchedule.length).toBeLessThan(withoutExtra.monthlySchedule.length)
    expect(withExtra.totalInterestPaid).toBeLessThan(withoutExtra.totalInterestPaid)
  })

  it('snowball targets smallest balance first', () => {
    const debts = [
      createDebt({ id: 'big', name: 'Big', balance: 500000, minimumPayment: 5000 }),
      createDebt({ id: 'small', name: 'Small', balance: 100000, minimumPayment: 5000 }),
    ]
    const strategy: PayoffStrategy = { method: 'snowball', extraPayment: 10000 }
    const result = calculatePayoff(debts, strategy)

    // Small debt should be paid off first
    const smallDebtPaidOffMonth = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'small')?.balance === 0
    )
    const bigDebtPaidOffMonth = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'big')?.balance === 0
    )
    expect(smallDebtPaidOffMonth).toBeLessThan(bigDebtPaidOffMonth)
  })

  it('avalanche targets highest rate first', () => {
    const debts = [
      createDebt({ id: 'low', name: 'Low Rate', balance: 100000, interestRate: 0.05, minimumPayment: 5000 }),
      createDebt({ id: 'high', name: 'High Rate', balance: 100000, interestRate: 0.25, minimumPayment: 5000 }),
    ]
    const strategy: PayoffStrategy = { method: 'avalanche', extraPayment: 10000 }
    const result = calculatePayoff(debts, strategy)

    // High rate debt should be paid off first
    const highRatePaidOff = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'high')?.balance === 0
    )
    const lowRatePaidOff = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'low')?.balance === 0
    )
    expect(highRatePaidOff).toBeLessThan(lowRatePaidOff)
  })
})
```

**Step 5: Run tests to verify they fail**

Run:
```bash
npx vitest run src/lib/calculator.test.ts
```
Expected: FAIL - module './calculator' not found

**Step 6: Implement calculator**

Create `src/lib/calculator.ts`:
```typescript
import type { Debt, PayoffStrategy, PayoffProjection, MonthSnapshot, DebtSnapshot } from './types'

export function sortDebtsByMethod(debts: Debt[], method: 'snowball' | 'avalanche'): Debt[] {
  return [...debts].sort((a, b) => {
    if (method === 'snowball') {
      return a.balance - b.balance // smallest first
    } else {
      return b.interestRate - a.interestRate // highest rate first
    }
  })
}

export function calculatePayoff(debts: Debt[], strategy: PayoffStrategy): PayoffProjection {
  if (debts.length === 0) {
    return {
      debtFreeDate: new Date(),
      totalInterestPaid: 0,
      totalPaid: 0,
      interestSaved: 0,
      monthlySchedule: [],
    }
  }

  // Clone debts with working balances
  const workingDebts = debts.map(d => ({
    ...d,
    workingBalance: d.balance,
  }))

  const monthlySchedule: MonthSnapshot[] = []
  let totalInterestPaid = 0
  let totalPaid = 0
  let currentDate = new Date()
  currentDate.setDate(1) // Start of current month

  const MAX_MONTHS = 360 // 30 years max

  while (workingDebts.some(d => d.workingBalance > 0) && monthlySchedule.length < MAX_MONTHS) {
    currentDate = new Date(currentDate)
    currentDate.setMonth(currentDate.getMonth() + 1)

    const debtSnapshots: DebtSnapshot[] = []
    let availableExtra = strategy.extraPayment

    // Sort debts by strategy to determine priority
    const sortedDebts = sortDebtsByMethod(
      workingDebts.filter(d => d.workingBalance > 0),
      strategy.method
    )

    // Process each debt
    for (const debt of workingDebts) {
      if (debt.workingBalance <= 0) {
        debtSnapshots.push({
          debtId: debt.id,
          balance: 0,
          payment: 0,
          interestPortion: 0,
          principalPortion: 0,
        })
        continue
      }

      // Calculate monthly interest
      const monthlyRate = debt.interestRate / 12
      const interestPortion = Math.round(debt.workingBalance * monthlyRate)

      // Base payment is minimum
      let payment = Math.min(debt.minimumPayment, debt.workingBalance + interestPortion)

      // Add extra payment if this is the priority debt
      if (sortedDebts[0]?.id === debt.id && availableExtra > 0) {
        const extraToApply = Math.min(availableExtra, debt.workingBalance + interestPortion - payment)
        payment += extraToApply
        availableExtra -= extraToApply
      }

      // Ensure payment doesn't exceed balance + interest
      payment = Math.min(payment, debt.workingBalance + interestPortion)

      const principalPortion = payment - interestPortion
      debt.workingBalance = Math.max(0, debt.workingBalance - principalPortion)

      totalInterestPaid += interestPortion
      totalPaid += payment

      debtSnapshots.push({
        debtId: debt.id,
        balance: debt.workingBalance,
        payment,
        interestPortion,
        principalPortion,
      })
    }

    monthlySchedule.push({
      month: new Date(currentDate),
      debts: debtSnapshots,
      totalBalance: workingDebts.reduce((sum, d) => sum + d.workingBalance, 0),
    })
  }

  // Calculate interest saved vs minimum-only payments
  const minimumOnlyProjection = calculateMinimumOnlyInterest(debts)
  const interestSaved = minimumOnlyProjection - totalInterestPaid

  return {
    debtFreeDate: currentDate,
    totalInterestPaid,
    totalPaid,
    interestSaved: Math.max(0, interestSaved),
    monthlySchedule,
  }
}

function calculateMinimumOnlyInterest(debts: Debt[]): number {
  const workingDebts = debts.map(d => ({ ...d, workingBalance: d.balance }))
  let totalInterest = 0
  let months = 0
  const MAX_MONTHS = 360

  while (workingDebts.some(d => d.workingBalance > 0) && months < MAX_MONTHS) {
    months++
    for (const debt of workingDebts) {
      if (debt.workingBalance <= 0) continue

      const monthlyRate = debt.interestRate / 12
      const interest = Math.round(debt.workingBalance * monthlyRate)
      const payment = Math.min(debt.minimumPayment, debt.workingBalance + interest)
      const principal = payment - interest

      totalInterest += interest
      debt.workingBalance = Math.max(0, debt.workingBalance - principal)
    }
  }

  return totalInterest
}
```

**Step 7: Run tests to verify they pass**

Run:
```bash
npx vitest run src/lib/calculator.test.ts
```
Expected: All tests PASS

**Step 8: Add test script to package.json**

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 9: Commit**

```bash
git add -A && git commit -m "feat: add payoff calculator with snowball/avalanche methods"
```

---

## Task 7: State Management (Zustand + React Query)

**Files:**
- Create: `src/stores/appStore.ts`
- Create: `src/hooks/useDebts.ts`
- Create: `src/hooks/useStrategy.ts`

**Step 1: Install dependencies**

Run:
```bash
npm install zustand @tanstack/react-query
```

**Step 2: Create app store**

Create `src/stores/appStore.ts`:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserPreferences } from '@/lib/types'

interface AppState {
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      preferences: {
        currency: 'USD',
        theme: 'system',
        payday: 1,
      },
      setPreferences: (newPrefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPrefs },
        })),
    }),
    {
      name: 'debtonator-preferences',
    }
  )
)
```

**Step 3: Create useDebts hook**

Create `src/hooks/useDebts.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debtRepository } from '@/lib/repository'
import type { Debt } from '@/lib/types'
import type { DebtInput } from '@/lib/validation'

export function useDebts() {
  return useQuery({
    queryKey: ['debts'],
    queryFn: () => debtRepository.getAll(),
  })
}

export function useDebt(id: string) {
  return useQuery({
    queryKey: ['debts', id],
    queryFn: () => debtRepository.getById(id),
    enabled: !!id,
  })
}

export function useCreateDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DebtInput) => debtRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useUpdateDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DebtInput> }) =>
      debtRepository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useDeleteDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => debtRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}
```

**Step 4: Create useStrategy hook**

Create `src/hooks/useStrategy.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsRepository } from '@/lib/repository'
import type { PayoffStrategy } from '@/lib/types'

export function useStrategy() {
  return useQuery({
    queryKey: ['strategy'],
    queryFn: () => settingsRepository.getStrategy(),
  })
}

export function useUpdateStrategy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (strategy: PayoffStrategy) => settingsRepository.setStrategy(strategy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategy'] })
    },
  })
}
```

**Step 5: Create usePayoffCalculator hook**

Create `src/hooks/usePayoffCalculator.ts`:
```typescript
import { useMemo } from 'react'
import { useDebts } from './useDebts'
import { useStrategy } from './useStrategy'
import { calculatePayoff } from '@/lib/calculator'
import type { PayoffProjection } from '@/lib/types'

export function usePayoffCalculator(): {
  projection: PayoffProjection | null
  isLoading: boolean
} {
  const { data: debts, isLoading: debtsLoading } = useDebts()
  const { data: strategy, isLoading: strategyLoading } = useStrategy()

  const projection = useMemo(() => {
    if (!debts || !strategy) return null
    return calculatePayoff(debts, strategy)
  }, [debts, strategy])

  return {
    projection,
    isLoading: debtsLoading || strategyLoading,
  }
}
```

**Step 6: Create hooks index**

Create `src/hooks/index.ts`:
```typescript
export { useDebts, useDebt, useCreateDebt, useUpdateDebt, useDeleteDebt } from './useDebts'
export { useStrategy, useUpdateStrategy } from './useStrategy'
export { usePayoffCalculator } from './usePayoffCalculator'
```

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add Zustand store and React Query hooks"
```

---

## Task 8: App Shell and Navigation

**Files:**
- Create: `src/components/layout/Shell.tsx`
- Create: `src/components/layout/BottomNav.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Install router**

Run:
```bash
npm install react-router-dom
```

**Step 2: Create Shell component**

Create `src/components/layout/Shell.tsx`:
```tsx
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Shell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white pb-20">
      <main className="container mx-auto max-w-lg px-4 py-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
```

**Step 3: Create BottomNav component**

Create `src/components/layout/BottomNav.tsx`:
```tsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/debts', icon: CreditCard, label: 'Debts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
      <div className="container mx-auto max-w-lg">
        <div className="flex justify-around">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
```

**Step 4: Create layout index**

Create `src/components/layout/index.ts`:
```typescript
export { Shell } from './Shell'
export { BottomNav } from './BottomNav'
```

**Step 5: Create placeholder pages**

Create `src/pages/Dashboard.tsx`:
```tsx
export function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-2">Your debt overview will appear here.</p>
    </div>
  )
}
```

Create `src/pages/Debts.tsx`:
```tsx
export function Debts() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Debts</h1>
      <p className="text-gray-600 mt-2">Manage your debts here.</p>
    </div>
  )
}
```

Create `src/pages/Settings.tsx`:
```tsx
export function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600 mt-2">Configure your preferences here.</p>
    </div>
  )
}
```

Create `src/pages/index.ts`:
```typescript
export { Dashboard } from './Dashboard'
export { Debts } from './Debts'
export { Settings } from './Settings'
```

**Step 6: Update App.tsx with routing**

Replace `src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Shell } from '@/components/layout'
import { Dashboard, Debts, Settings } from '@/pages'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
```

**Step 7: Test navigation works**

Run: `npm run dev`
Expected: App loads with bottom navigation, clicking tabs switches pages

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: add app shell with bottom navigation"
```

---

## Task 9: Debt Form Component

**Files:**
- Create: `src/components/debts/DebtForm.tsx`
- Create: `src/components/debts/index.ts`

**Step 1: Install form library**

Run:
```bash
npm install react-hook-form @hookform/resolvers
```

**Step 2: Create DebtForm component**

Create `src/components/debts/DebtForm.tsx`:
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { debtSchema, type DebtInput } from '@/lib/validation'

interface DebtFormProps {
  defaultValues?: Partial<DebtInput>
  onSubmit: (data: DebtInput) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function DebtForm({ defaultValues, onSubmit, onCancel, isLoading }: DebtFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DebtInput>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      ...defaultValues,
    },
  })

  const processSubmit = (data: DebtInput) => {
    // Convert dollars to cents for storage
    onSubmit({
      ...data,
      balance: Math.round(data.balance * 100),
      minimumPayment: Math.round(data.minimumPayment * 100),
      interestRate: data.interestRate / 100, // Convert percentage to decimal
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{defaultValues ? 'Edit Debt' : 'Add New Debt'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Chase Visa"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance ($)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('balance', { valueAsNumber: true })}
            />
            {errors.balance && (
              <p className="text-sm text-red-500">{errors.balance.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="18.99"
              {...register('interestRate', { valueAsNumber: true })}
            />
            {errors.interestRate && (
              <p className="text-sm text-red-500">{errors.interestRate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumPayment">Minimum Payment ($)</Label>
            <Input
              id="minimumPayment"
              type="number"
              step="0.01"
              min="0"
              placeholder="25.00"
              {...register('minimumPayment', { valueAsNumber: true })}
            />
            {errors.minimumPayment && (
              <p className="text-sm text-red-500">{errors.minimumPayment.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : defaultValues ? 'Update' : 'Add Debt'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

**Step 3: Create debts index**

Create `src/components/debts/index.ts`:
```typescript
export { DebtForm } from './DebtForm'
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add DebtForm component with validation"
```

---

## Task 10: Debt Card and List Components

**Files:**
- Create: `src/components/debts/DebtCard.tsx`
- Create: `src/components/debts/DebtList.tsx`
- Modify: `src/components/debts/index.ts`

**Step 1: Create DebtCard component**

Create `src/components/debts/DebtCard.tsx`:
```tsx
import { Trash2, Pencil } from 'lucide-react'
import { Card, CardContent, Button } from '@/components/ui'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Debt } from '@/lib/types'

interface DebtCardProps {
  debt: Debt
  isPriority?: boolean
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
}

export function DebtCard({ debt, isPriority, onEdit, onDelete }: DebtCardProps) {
  return (
    <Card className={isPriority ? 'ring-2 ring-primary-500' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{debt.name}</h3>
              {isPriority && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  Focus
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(debt.balance)}
            </p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>{formatPercent(debt.interestRate)} APR</span>
              <span>{formatCurrency(debt.minimumPayment)}/mo min</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(debt)}
              aria-label="Edit debt"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(debt.id)}
              aria-label="Delete debt"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Create DebtList component**

Create `src/components/debts/DebtList.tsx`:
```tsx
import { DebtCard } from './DebtCard'
import { sortDebtsByMethod } from '@/lib/calculator'
import type { Debt, PayoffStrategy } from '@/lib/types'

interface DebtListProps {
  debts: Debt[]
  strategy: PayoffStrategy
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
}

export function DebtList({ debts, strategy, onEdit, onDelete }: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No debts added yet.</p>
        <p className="text-gray-400 text-sm mt-1">Add your first debt to get started!</p>
      </div>
    )
  }

  const sortedDebts = sortDebtsByMethod(debts, strategy.method)
  const priorityDebtId = sortedDebts[0]?.id

  return (
    <div className="space-y-3">
      {sortedDebts.map((debt) => (
        <DebtCard
          key={debt.id}
          debt={debt}
          isPriority={debt.id === priorityDebtId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
```

**Step 3: Update debts index**

Update `src/components/debts/index.ts`:
```typescript
export { DebtForm } from './DebtForm'
export { DebtCard } from './DebtCard'
export { DebtList } from './DebtList'
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add DebtCard and DebtList components"
```

---

## Task 11: Debts Page Implementation

**Files:**
- Modify: `src/pages/Debts.tsx`
- Create: `src/components/ui/dialog.tsx`

**Step 1: Install Dialog primitive**

Run:
```bash
npm install @radix-ui/react-dialog
```

**Step 2: Create Dialog component**

Create `src/components/ui/dialog.tsx`:
```tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
}
```

**Step 3: Update UI index**

Update `src/components/ui/index.ts`:
```typescript
export { Button, buttonVariants } from './button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export { Input } from './input'
export { Label } from './label'
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog'
```

**Step 4: Implement Debts page**

Replace `src/pages/Debts.tsx`:
```tsx
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import { DebtForm, DebtList } from '@/components/debts'
import { useDebts, useCreateDebt, useUpdateDebt, useDeleteDebt, useStrategy } from '@/hooks'
import type { Debt } from '@/lib/types'
import type { DebtInput } from '@/lib/validation'

export function Debts() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const { data: debts = [], isLoading: debtsLoading } = useDebts()
  const { data: strategy } = useStrategy()
  const createDebt = useCreateDebt()
  const updateDebt = useUpdateDebt()
  const deleteDebt = useDeleteDebt()

  const handleCreate = async (data: DebtInput) => {
    await createDebt.mutateAsync(data)
    setIsFormOpen(false)
  }

  const handleUpdate = async (data: DebtInput) => {
    if (!editingDebt) return
    await updateDebt.mutateAsync({ id: editingDebt.id, data })
    setEditingDebt(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this debt?')) {
      await deleteDebt.mutateAsync(id)
    }
  }

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt)
  }

  if (debtsLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Debts</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Debt
        </Button>
      </div>

      {strategy && (
        <DebtList
          debts={debts}
          strategy={strategy}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Debt Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Debt</DialogTitle>
          </DialogHeader>
          <DebtForm
            onSubmit={handleCreate}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createDebt.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Debt Dialog */}
      <Dialog open={!!editingDebt} onOpenChange={() => setEditingDebt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Debt</DialogTitle>
          </DialogHeader>
          {editingDebt && (
            <DebtForm
              defaultValues={{
                name: editingDebt.name,
                balance: editingDebt.balance / 100,
                interestRate: editingDebt.interestRate * 100,
                minimumPayment: editingDebt.minimumPayment / 100,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingDebt(null)}
              isLoading={updateDebt.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

**Step 5: Test debts page**

Run: `npm run dev`
Expected: Can add, edit, and delete debts. Debts persist in IndexedDB.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: implement Debts page with CRUD operations"
```

---

## Task 12: Dashboard Charts

**Files:**
- Create: `src/components/dashboard/ProgressRing.tsx`
- Create: `src/components/dashboard/PayoffTimeline.tsx`
- Create: `src/components/dashboard/StatCard.tsx`
- Create: `src/components/dashboard/index.ts`

**Step 1: Install Recharts**

Run:
```bash
npm install recharts
```

**Step 2: Create ProgressRing component**

Create `src/components/dashboard/ProgressRing.tsx`:
```tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ProgressRingProps {
  totalDebt: number
  paidOff: number
  currency?: string
}

export function ProgressRing({ totalDebt, paidOff, currency = 'USD' }: ProgressRingProps) {
  const remaining = totalDebt - paidOff
  const percentPaid = totalDebt > 0 ? Math.round((paidOff / totalDebt) * 100) : 0

  const data = [
    { name: 'Paid', value: paidOff },
    { name: 'Remaining', value: remaining },
  ]

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill="#10b981" />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{percentPaid}%</span>
        <span className="text-sm text-gray-500">paid off</span>
      </div>
    </div>
  )
}
```

**Step 3: Create PayoffTimeline component**

Create `src/components/dashboard/PayoffTimeline.tsx`:
```tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { MonthSnapshot } from '@/lib/types'

interface PayoffTimelineProps {
  schedule: MonthSnapshot[]
}

export function PayoffTimeline({ schedule }: PayoffTimelineProps) {
  const data = schedule.map((month, index) => ({
    month: index + 1,
    label: month.month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    balance: month.totalBalance / 100,
  }))

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Add debts to see your payoff timeline
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value * 100), 'Balance']}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#balanceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
```

**Step 4: Create StatCard component**

Create `src/components/dashboard/StatCard.tsx`:
```tsx
import { Card, CardContent } from '@/components/ui'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  sublabel?: string
  icon?: LucideIcon
}

export function StatCard({ label, value, sublabel, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
          </div>
          {Icon && (
            <div className="p-2 bg-primary-50 rounded-lg">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 5: Create dashboard index**

Create `src/components/dashboard/index.ts`:
```typescript
export { ProgressRing } from './ProgressRing'
export { PayoffTimeline } from './PayoffTimeline'
export { StatCard } from './StatCard'
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add dashboard chart components"
```

---

## Task 13: Dashboard Page Implementation

**Files:**
- Modify: `src/pages/Dashboard.tsx`

**Step 1: Implement Dashboard page**

Replace `src/pages/Dashboard.tsx`:
```tsx
import { Calendar, DollarSign, TrendingDown, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ProgressRing, PayoffTimeline, StatCard } from '@/components/dashboard'
import { useDebts, usePayoffCalculator } from '@/hooks'
import { formatCurrency } from '@/lib/utils'

export function Dashboard() {
  const { data: debts = [] } = useDebts()
  const { projection, isLoading } = usePayoffCalculator()

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinimum = debts.reduce((sum, d) => sum + d.minimumPayment, 0)

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const monthsUntilFree = projection?.monthlySchedule.length ?? 0
  const yearsUntilFree = Math.floor(monthsUntilFree / 12)
  const remainingMonths = monthsUntilFree % 12

  const timeUntilFree =
    yearsUntilFree > 0
      ? `${yearsUntilFree}y ${remainingMonths}m`
      : `${remainingMonths} months`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Track your journey to debt freedom</p>
      </div>

      {debts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No debts added yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Add your first debt to see your payoff projection!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress Ring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(totalDebt)}
                </span>
              </div>
              <ProgressRing totalDebt={totalDebt} paidOff={0} />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Debt Free Date"
              value={projection ? formatDate(projection.debtFreeDate) : '-'}
              sublabel={timeUntilFree}
              icon={Calendar}
            />
            <StatCard
              label="Monthly Payment"
              value={formatCurrency(totalMinimum + (projection ? 0 : 0))}
              sublabel="minimums only"
              icon={DollarSign}
            />
            <StatCard
              label="Interest Saved"
              value={formatCurrency(projection?.interestSaved ?? 0)}
              sublabel="vs minimum payments"
              icon={TrendingDown}
            />
            <StatCard
              label="Total Interest"
              value={formatCurrency(projection?.totalInterestPaid ?? 0)}
              sublabel="over payoff period"
              icon={Target}
            />
          </div>

          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Payoff Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <PayoffTimeline schedule={projection?.monthlySchedule ?? []} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
```

**Step 2: Test dashboard**

Run: `npm run dev`
Expected: Dashboard shows debt totals, projections, and timeline chart

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: implement Dashboard page with projections"
```

---

## Task 14: Settings Page Implementation

**Files:**
- Modify: `src/pages/Settings.tsx`
- Create: `src/components/ui/switch.tsx`

**Step 1: Install Switch primitive**

Run:
```bash
npm install @radix-ui/react-switch
```

**Step 2: Create Switch component**

Create `src/components/ui/switch.tsx`:
```tsx
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-gray-200",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

**Step 3: Update UI index**

Add to `src/components/ui/index.ts`:
```typescript
export { Switch } from './switch'
```

**Step 4: Implement Settings page**

Replace `src/pages/Settings.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle, Label, Input, Switch } from '@/components/ui'
import { useStrategy, useUpdateStrategy } from '@/hooks'
import { formatCurrency } from '@/lib/utils'

export function Settings() {
  const { data: strategy } = useStrategy()
  const updateStrategy = useUpdateStrategy()

  const handleMethodToggle = (checked: boolean) => {
    if (!strategy) return
    updateStrategy.mutate({
      ...strategy,
      method: checked ? 'avalanche' : 'snowball',
    })
  }

  const handleExtraPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!strategy) return
    const value = parseFloat(e.target.value) || 0
    updateStrategy.mutate({
      ...strategy,
      extraPayment: Math.round(value * 100),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your payoff strategy</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payoff Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="method-toggle" className="text-base">
                {strategy?.method === 'avalanche' ? 'Avalanche' : 'Snowball'}
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                {strategy?.method === 'avalanche'
                  ? 'Pay highest interest rate first (saves money)'
                  : 'Pay smallest balance first (quick wins)'}
              </p>
            </div>
            <Switch
              id="method-toggle"
              checked={strategy?.method === 'avalanche'}
              onCheckedChange={handleMethodToggle}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Snowball</p>
                <p className="text-xs text-gray-500">Smallest balance first</p>
              </div>
              <div className="text-center px-4">
                <span className="text-xs text-gray-400">←</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">Avalanche</p>
                <p className="text-xs text-gray-500">Highest rate first</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extra Monthly Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Additional amount to put toward debt each month
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="10"
              className="pl-7"
              value={strategy ? strategy.extraPayment / 100 : 0}
              onChange={handleExtraPaymentChange}
            />
          </div>
          {strategy && strategy.extraPayment > 0 && (
            <p className="text-sm text-primary-600 mt-2">
              Adding {formatCurrency(strategy.extraPayment)} extra per month
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Debtonator helps you pay off debt faster using proven strategies.
            Your data is stored locally on your device for privacy.
          </p>
          <p className="text-xs text-gray-400 mt-4">Version 1.0.0</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 5: Test settings**

Run: `npm run dev`
Expected: Can toggle method and set extra payment, changes reflect in dashboard

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: implement Settings page with strategy configuration"
```

---

## Task 15: PWA Configuration

**Files:**
- Modify: `vite.config.ts`
- Create: `public/icons/` (multiple sizes)
- Create: `public/manifest.json`

**Step 1: Install PWA plugin**

Run:
```bash
npm install -D vite-plugin-pwa
```

**Step 2: Update vite.config.ts**

Replace `vite.config.ts`:
```typescript
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Debtonator',
        short_name: 'Debtonator',
        description: 'Track and pay off your debts faster',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**Step 3: Create placeholder icons**

Create `public/icons/` directory and add placeholder SVGs that will be converted to PNGs:

Create `public/icons/icon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#10b981"/>
  <text x="256" y="320" font-size="280" font-weight="bold" fill="white" text-anchor="middle" font-family="system-ui">D</text>
</svg>
```

Note: For production, generate proper PNG icons from this SVG using a tool like Sharp or an online converter.

**Step 4: Update index.html**

Update `index.html` head section:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#10b981" />
    <meta name="description" content="Track and pay off your debts faster with Debtonator" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    <title>Debtonator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 5: Build and test PWA**

Run:
```bash
npm run build
npm run preview
```
Expected: App is installable, works offline after first load

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add PWA configuration with service worker"
```

---

## Task 16: Final Polish and Testing

**Files:**
- Various style tweaks
- Run full test suite

**Step 1: Add animations to tailwind config**

Update `tailwind.config.js` to add animations:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
}
```

**Step 2: Run linting**

Run:
```bash
npm run lint
```
Expected: No errors (fix any that appear)

**Step 3: Run full test suite**

Run:
```bash
npm run test
```
Expected: All tests pass

**Step 4: Build production**

Run:
```bash
npm run build
```
Expected: Build succeeds with no errors

**Step 5: Final commit**

```bash
git add -A && git commit -m "chore: final polish and configuration"
```

**Step 6: Push to GitHub**

```bash
git push origin main
```

---

## Summary

After completing all tasks, you will have:

- A fully functional PWA for debt tracking
- Snowball and avalanche payoff methods
- Beautiful dashboard with charts and projections
- Local-first data storage with IndexedDB
- Offline capability
- Test coverage for calculator logic
- Clean, maintainable codebase

**Next steps for Tier 2 features:**
- Add CSV/PDF export
- Add categories and tags
- Add reminder notifications
- Add weekly/monthly trend charts
