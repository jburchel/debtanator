# Envelope Budget App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a zero-based envelope budgeting PWA with family sharing, real-time sync, and offline support.

**Architecture:** React frontend with Supabase backend. Offline-first with optimistic updates. Row Level Security for multi-tenant data isolation. Zustand for local state, React Query for server state.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui, Supabase, Zustand, React Query, react-i18next, Vitest, Playwright

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Vite React TypeScript Project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `index.html`

**Step 1: Create Vite project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

Expected: Project scaffolded with React + TypeScript template

**Step 2: Install dependencies**

Run:
```bash
npm install
```

Expected: node_modules created, dependencies installed

**Step 3: Verify dev server works**

Run:
```bash
npm run dev
```

Expected: Dev server at http://localhost:5173 showing Vite + React page

**Step 4: Commit**

```bash
git add .
git commit -m "chore: initialize Vite React TypeScript project"
```

---

### Task 2: Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css`

**Step 1: Install Tailwind and dependencies**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: `tailwind.config.js` and `postcss.config.js` created

**Step 2: Configure content paths**

Replace `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 3: Add Tailwind directives to CSS**

Replace `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Test Tailwind works**

Replace `src/App.tsx`:
```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Envelope Budget
      </h1>
    </div>
  )
}

export default App
```

Run: `npm run dev`
Expected: Centered heading with gray background

**Step 5: Commit**

```bash
git add .
git commit -m "chore: configure Tailwind CSS with dark mode"
```

---

### Task 3: Set Up Shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

**Step 1: Install Shadcn CLI and initialize**

Run:
```bash
npx shadcn@latest init
```

When prompted:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Expected: `components.json` created, CSS variables added

**Step 2: Install first component to verify setup**

Run:
```bash
npx shadcn@latest add button
```

Expected: `src/components/ui/button.tsx` created

**Step 3: Test Button component**

Replace `src/App.tsx`:
```tsx
import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center gap-4">
      <Button variant="default">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}

export default App
```

Run: `npm run dev`
Expected: Three styled buttons displayed

**Step 4: Commit**

```bash
git add .
git commit -m "chore: set up Shadcn/ui with Button component"
```

---

### Task 4: Configure Path Aliases

**Files:**
- Modify: `tsconfig.json`
- Modify: `vite.config.ts`

**Step 1: Update tsconfig.json**

Ensure these compiler options exist:
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

**Step 2: Install vite path resolution**

Run:
```bash
npm install -D @types/node
```

**Step 3: Update vite.config.ts**

Replace content:
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

**Step 4: Verify imports work**

Run: `npm run dev`
Expected: No import errors, app still works

**Step 5: Commit**

```bash
git add .
git commit -m "chore: configure path aliases for @/ imports"
```

---

### Task 5: Set Up Testing with Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/utils.test.ts`
- Modify: `package.json`

**Step 1: Install testing dependencies**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

**Step 2: Create vitest config**

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

**Step 3: Create test setup file**

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

**Step 4: Add test script to package.json**

Add to scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

**Step 5: Write first test**

Create `src/lib/utils.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'always')
    expect(result).toBe('base always')
  })
})
```

**Step 6: Run tests**

Run: `npm run test:run`
Expected: 2 tests pass

**Step 7: Commit**

```bash
git add .
git commit -m "chore: set up Vitest with React Testing Library"
```

---

### Task 6: Set Up React Router

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/pages/Login.tsx`
- Create: `src/pages/NotFound.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Install React Router**

Run:
```bash
npm install react-router-dom
```

**Step 2: Create page components**

Create `src/pages/Home.tsx`:
```tsx
export function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <h1 className="text-3xl font-bold">Envelope Budget</h1>
    </div>
  )
}
```

Create `src/pages/Login.tsx`:
```tsx
export function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <h1 className="text-3xl font-bold">Login</h1>
    </div>
  )
}
```

Create `src/pages/NotFound.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  )
}
```

**Step 3: Set up router in App.tsx**

Replace `src/App.tsx`:
```tsx
import { Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
```

**Step 4: Wrap app with BrowserRouter**

Replace `src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Step 5: Test routing**

Run: `npm run dev`
- Visit `/` - see "Envelope Budget"
- Visit `/login` - see "Login"
- Visit `/invalid` - see 404 page

**Step 6: Commit**

```bash
git add .
git commit -m "feat: set up React Router with basic pages"
```

---

### Task 7: Configure PWA

**Files:**
- Create: `public/manifest.json`
- Create: `public/icons/icon-192.png` (placeholder)
- Create: `public/icons/icon-512.png` (placeholder)
- Modify: `vite.config.ts`
- Modify: `index.html`

**Step 1: Install PWA plugin**

Run:
```bash
npm install -D vite-plugin-pwa
```

**Step 2: Create manifest.json**

Create `public/manifest.json`:
```json
{
  "name": "Envelope Budget",
  "short_name": "Envelopes",
  "description": "Zero-based envelope budgeting app",
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Step 3: Create placeholder icons directory**

Run:
```bash
mkdir -p public/icons
```

Create simple placeholder SVG icons (will replace with proper icons later):

Create `public/icons/icon-192.png` and `public/icons/icon-512.png` as placeholder files (can use any 192x192 and 512x512 PNG).

**Step 4: Update vite.config.ts**

Replace content:
```typescript
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: false, // We use public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**Step 5: Add manifest link to index.html**

Add to `<head>` in `index.html`:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0f172a" />
```

**Step 6: Build and verify PWA**

Run:
```bash
npm run build
npm run preview
```

Expected: App installable as PWA (check DevTools > Application > Manifest)

**Step 7: Commit**

```bash
git add .
git commit -m "chore: configure PWA with manifest and service worker"
```

---

## Phase 2: Supabase Integration

### Task 8: Set Up Supabase Client

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `.env.local`
- Create: `.env.example`
- Modify: `.gitignore`

**Step 1: Install Supabase client**

Run:
```bash
npm install @supabase/supabase-js
```

**Step 2: Create environment files**

Create `.env.example`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Create `.env.local` (with real values from Supabase dashboard):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

**Step 3: Add .env.local to .gitignore**

Add to `.gitignore`:
```
.env.local
```

**Step 4: Create Supabase client**

Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 5: Commit**

```bash
git add .
git commit -m "chore: set up Supabase client with environment config"
```

---

### Task 9: Create Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: Create migrations directory**

Run:
```bash
mkdir -p supabase/migrations
```

**Step 2: Write initial schema migration**

Create `supabase/migrations/001_initial_schema.sql`:
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Households table
create table households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null
);

-- Household members table
create table household_members (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('admin', 'member')) default 'member' not null,
  invited_email text,
  status text check (status in ('pending', 'accepted')) default 'pending' not null,
  joined_at timestamptz,
  created_at timestamptz default now() not null,
  unique(household_id, user_id),
  unique(household_id, invited_email)
);

-- Budget periods table
create table budget_periods (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  year integer not null,
  month integer check (month >= 1 and month <= 12) not null,
  total_income numeric(12,2) default 0 not null,
  created_at timestamptz default now() not null,
  unique(household_id, year, month)
);

-- Envelopes table
create table envelopes (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  name text not null,
  emoji text,
  color text,
  sort_order integer default 0 not null,
  is_archived boolean default false not null,
  created_at timestamptz default now() not null
);

-- Envelope allocations table
create table envelope_allocations (
  id uuid primary key default uuid_generate_v4(),
  envelope_id uuid references envelopes(id) on delete cascade not null,
  budget_period_id uuid references budget_periods(id) on delete cascade not null,
  allocated_amount numeric(12,2) default 0 not null,
  rollover_amount numeric(12,2) default 0 not null,
  created_at timestamptz default now() not null,
  unique(envelope_id, budget_period_id)
);

-- Transactions table
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  envelope_id uuid references envelopes(id) on delete set null,
  amount numeric(12,2) not null,
  description text,
  merchant text,
  date date default current_date not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);

-- User preferences table
create table user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  theme text check (theme in ('light', 'dark', 'system')) default 'system' not null,
  language text default 'en' not null,
  currency text default 'USD' not null,
  onboarding_completed boolean default false not null,
  created_at timestamptz default now() not null
);

-- Create indexes
create index idx_household_members_user on household_members(user_id);
create index idx_household_members_household on household_members(household_id);
create index idx_budget_periods_household on budget_periods(household_id);
create index idx_envelopes_household on envelopes(household_id);
create index idx_transactions_household on transactions(household_id);
create index idx_transactions_envelope on transactions(envelope_id);
create index idx_transactions_date on transactions(date);
```

**Step 3: Apply migration via Supabase dashboard**

Go to Supabase Dashboard > SQL Editor and run the migration.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add initial database schema migration"
```

---

### Task 10: Create Row Level Security Policies

**Files:**
- Create: `supabase/migrations/002_rls_policies.sql`

**Step 1: Write RLS policies**

Create `supabase/migrations/002_rls_policies.sql`:
```sql
-- Enable RLS on all tables
alter table households enable row level security;
alter table household_members enable row level security;
alter table budget_periods enable row level security;
alter table envelopes enable row level security;
alter table envelope_allocations enable row level security;
alter table transactions enable row level security;
alter table user_preferences enable row level security;

-- Helper function to get user's household IDs
create or replace function get_user_household_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select household_id from household_members
  where user_id = auth.uid() and status = 'accepted'
$$;

-- Households policies
create policy "Users can view their households"
  on households for select
  using (id in (select get_user_household_ids()));

create policy "Users can create households"
  on households for insert
  with check (owner_id = auth.uid());

create policy "Owners can update their households"
  on households for update
  using (owner_id = auth.uid());

create policy "Owners can delete their households"
  on households for delete
  using (owner_id = auth.uid());

-- Household members policies
create policy "Users can view members of their households"
  on household_members for select
  using (household_id in (select get_user_household_ids()));

create policy "Admins can invite members"
  on household_members for insert
  with check (
    household_id in (
      select household_id from household_members
      where user_id = auth.uid() and role = 'admin' and status = 'accepted'
    )
  );

create policy "Admins can update members"
  on household_members for update
  using (
    household_id in (
      select household_id from household_members
      where user_id = auth.uid() and role = 'admin' and status = 'accepted'
    )
  );

create policy "Admins can remove members"
  on household_members for delete
  using (
    household_id in (
      select household_id from household_members
      where user_id = auth.uid() and role = 'admin' and status = 'accepted'
    )
  );

-- Budget periods policies
create policy "Users can view their budget periods"
  on budget_periods for select
  using (household_id in (select get_user_household_ids()));

create policy "Users can create budget periods"
  on budget_periods for insert
  with check (household_id in (select get_user_household_ids()));

create policy "Users can update budget periods"
  on budget_periods for update
  using (household_id in (select get_user_household_ids()));

-- Envelopes policies
create policy "Users can view their envelopes"
  on envelopes for select
  using (household_id in (select get_user_household_ids()));

create policy "Users can create envelopes"
  on envelopes for insert
  with check (household_id in (select get_user_household_ids()));

create policy "Users can update envelopes"
  on envelopes for update
  using (household_id in (select get_user_household_ids()));

create policy "Users can delete envelopes"
  on envelopes for delete
  using (household_id in (select get_user_household_ids()));

-- Envelope allocations policies
create policy "Users can view their allocations"
  on envelope_allocations for select
  using (
    envelope_id in (
      select id from envelopes
      where household_id in (select get_user_household_ids())
    )
  );

create policy "Users can create allocations"
  on envelope_allocations for insert
  with check (
    envelope_id in (
      select id from envelopes
      where household_id in (select get_user_household_ids())
    )
  );

create policy "Users can update allocations"
  on envelope_allocations for update
  using (
    envelope_id in (
      select id from envelopes
      where household_id in (select get_user_household_ids())
    )
  );

-- Transactions policies
create policy "Users can view their transactions"
  on transactions for select
  using (household_id in (select get_user_household_ids()));

create policy "Users can create transactions"
  on transactions for insert
  with check (household_id in (select get_user_household_ids()));

create policy "Users can update transactions"
  on transactions for update
  using (household_id in (select get_user_household_ids()));

create policy "Users can delete transactions"
  on transactions for delete
  using (household_id in (select get_user_household_ids()));

-- User preferences policies
create policy "Users can view their own preferences"
  on user_preferences for select
  using (user_id = auth.uid());

create policy "Users can create their own preferences"
  on user_preferences for insert
  with check (user_id = auth.uid());

create policy "Users can update their own preferences"
  on user_preferences for update
  using (user_id = auth.uid());
```

**Step 2: Apply migration via Supabase dashboard**

Go to Supabase Dashboard > SQL Editor and run the migration.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add Row Level Security policies"
```

---

### Task 11: Generate TypeScript Types from Supabase

**Files:**
- Create: `src/types/database.ts`

**Step 1: Install Supabase CLI (if not installed)**

Run:
```bash
npm install -D supabase
```

**Step 2: Generate types**

Run:
```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
```

Or manually create the types file.

**Step 3: Create types file manually (if CLI not available)**

Create `src/types/database.ts`:
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
        }
      }
      household_members: {
        Row: {
          id: string
          household_id: string
          user_id: string | null
          role: 'admin' | 'member'
          invited_email: string | null
          status: 'pending' | 'accepted'
          joined_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          user_id?: string | null
          role?: 'admin' | 'member'
          invited_email?: string | null
          status?: 'pending' | 'accepted'
          joined_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          user_id?: string | null
          role?: 'admin' | 'member'
          invited_email?: string | null
          status?: 'pending' | 'accepted'
          joined_at?: string | null
          created_at?: string
        }
      }
      budget_periods: {
        Row: {
          id: string
          household_id: string
          year: number
          month: number
          total_income: number
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          year: number
          month: number
          total_income?: number
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          year?: number
          month?: number
          total_income?: number
          created_at?: string
        }
      }
      envelopes: {
        Row: {
          id: string
          household_id: string
          name: string
          emoji: string | null
          color: string | null
          sort_order: number
          is_archived: boolean
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          emoji?: string | null
          color?: string | null
          sort_order?: number
          is_archived?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          emoji?: string | null
          color?: string | null
          sort_order?: number
          is_archived?: boolean
          created_at?: string
        }
      }
      envelope_allocations: {
        Row: {
          id: string
          envelope_id: string
          budget_period_id: string
          allocated_amount: number
          rollover_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          envelope_id: string
          budget_period_id: string
          allocated_amount?: number
          rollover_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          envelope_id?: string
          budget_period_id?: string
          allocated_amount?: number
          rollover_amount?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          household_id: string
          envelope_id: string | null
          amount: number
          description: string | null
          merchant: string | null
          date: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          envelope_id?: string | null
          amount: number
          description?: string | null
          merchant?: string | null
          date?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          envelope_id?: string | null
          amount?: number
          description?: string | null
          merchant?: string | null
          date?: string
          created_by?: string | null
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: string
          currency: string
          onboarding_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          currency?: string
          onboarding_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          currency?: string
          onboarding_completed?: boolean
          created_at?: string
        }
      }
    }
  }
}

// Convenience types
export type Household = Database['public']['Tables']['households']['Row']
export type HouseholdMember = Database['public']['Tables']['household_members']['Row']
export type BudgetPeriod = Database['public']['Tables']['budget_periods']['Row']
export type Envelope = Database['public']['Tables']['envelopes']['Row']
export type EnvelopeAllocation = Database['public']['Tables']['envelope_allocations']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
```

**Step 4: Update Supabase client with types**

Modify `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add TypeScript types for database schema"
```

---

## Phase 3: Authentication

### Task 12: Create Auth Store with Zustand

**Files:**
- Create: `src/stores/auth-store.ts`
- Create: `src/stores/auth-store.test.ts`

**Step 1: Install Zustand**

Run:
```bash
npm install zustand
```

**Step 2: Write failing test**

Create `src/stores/auth-store.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, session: null, loading: true })
  })

  it('starts with loading true and no user', () => {
    const state = useAuthStore.getState()
    expect(state.loading).toBe(true)
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
  })

  it('setUser updates user and sets loading false', () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    useAuthStore.getState().setUser(mockUser as any)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.loading).toBe(false)
  })

  it('clearUser resets state', () => {
    useAuthStore.getState().setUser({ id: '123' } as any)
    useAuthStore.getState().clearUser()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(false)
  })
})
```

**Step 3: Run test to verify it fails**

Run: `npm run test:run`
Expected: FAIL - module not found

**Step 4: Implement auth store**

Create `src/stores/auth-store.ts`:
```typescript
import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setSession: (session) => set({ session }),
  clearUser: () => set({ user: null, session: null, loading: false }),
}))
```

**Step 5: Run test to verify it passes**

Run: `npm run test:run`
Expected: PASS

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Zustand auth store"
```

---

### Task 13: Create Auth Provider Component

**Files:**
- Create: `src/components/providers/AuthProvider.tsx`
- Modify: `src/main.tsx`

**Step 1: Create AuthProvider**

Create `src/components/providers/AuthProvider.tsx`:
```tsx
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setSession, clearUser } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setSession, clearUser])

  return <>{children}</>
}
```

**Step 2: Wrap app with AuthProvider**

Modify `src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/components/providers/AuthProvider'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Step 3: Verify app still runs**

Run: `npm run dev`
Expected: No errors, app loads

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add AuthProvider for session management"
```

---

### Task 14: Create Login Page with Email/Password

**Files:**
- Modify: `src/pages/Login.tsx`
- Create: `src/components/auth/LoginForm.tsx`

**Step 1: Install Shadcn form components**

Run:
```bash
npx shadcn@latest add input label card
```

**Step 2: Create LoginForm component**

Create `src/components/auth/LoginForm.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Enter your credentials to access your budget'
            : 'Sign up to start managing your money'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {error && (
            <p className={`text-sm ${error.includes('Check your email') ? 'text-green-600' : 'text-destructive'}`}>
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
```

**Step 3: Update Login page**

Replace `src/pages/Login.tsx`:
```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { LoginForm } from '@/components/auth/LoginForm'

export function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
```

**Step 4: Test login page**

Run: `npm run dev`
Visit: `/login`
Expected: Login form with email/password fields, toggle between login/signup

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add login and signup forms"
```

---

### Task 15: Create Protected Route Component

**Files:**
- Create: `src/components/auth/ProtectedRoute.tsx`
- Modify: `src/App.tsx`

**Step 1: Create ProtectedRoute**

Create `src/components/auth/ProtectedRoute.tsx`:
```tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

**Step 2: Wrap protected routes**

Modify `src/App.tsx`:
```tsx
import { Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { NotFound } from '@/pages/NotFound'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
```

**Step 3: Test protection**

Run: `npm run dev`
- Visit `/` without being logged in
- Expected: Redirected to `/login`

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add protected route for authenticated pages"
```

---

## Phase 4: Core Features (Summary - Expand as Needed)

The remaining phases follow the same pattern. Here's an outline:

### Phase 4: Core Features
- Task 16: Create household on first login
- Task 17: Create React Query hooks for data fetching
- Task 18: Build envelope list component
- Task 19: Build transaction entry modal
- Task 20: Build budget period selector
- Task 21: Build envelope detail view

### Phase 5: Dashboard
- Task 22: Create dashboard layout
- Task 23: Build income allocation bar
- Task 24: Build envelope grid with progress
- Task 25: Add quick-add FAB

### Phase 6: Theming
- Task 26: Create theme store
- Task 27: Build theme toggle component
- Task 28: Add system preference detection

### Phase 7: Onboarding
- Task 29: Create onboarding flow
- Task 30: Build income entry step
- Task 31: Build envelope template selection
- Task 32: Build allocation wizard

### Phase 8: Family Sharing
- Task 33: Build invite flow
- Task 34: Add real-time subscriptions
- Task 35: Show transaction attribution

### Phase 9: Localization
- Task 36: Set up react-i18next
- Task 37: Create translation files
- Task 38: Add language selector

### Phase 10: Polish & Deploy
- Task 39: Add loading states and skeletons
- Task 40: Add error boundaries
- Task 41: Set up Sentry
- Task 42: Deploy to Vercel
- Task 43: Configure custom domain

---

## Execution Notes

- Each phase builds on the previous
- Run tests after each task: `npm run test:run`
- Commit frequently (after each task)
- The plan prioritizes core functionality first
- Premium features (bank sync, advanced reports) deferred to post-MVP
