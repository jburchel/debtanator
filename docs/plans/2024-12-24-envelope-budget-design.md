# Envelope Budget App - Design Document

## Overview

A digital envelope budgeting PWA that helps users allocate money to categories and track spending using zero-based budgeting principles. Supports family sharing, real-time sync, and works offline.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18+ with TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + Shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| State | Zustand (local) + React Query (server) |
| i18n | react-i18next |
| PWA | Vite PWA plugin |
| Hosting | Vercel or Netlify |

## Architecture

### Core Patterns

- **Offline-first**: Local state syncs to Supabase when online
- **Optimistic updates**: UI updates immediately, syncs in background
- **Real-time subscriptions**: Family members see changes instantly
- **Row Level Security**: Database enforces household data boundaries

### Project Structure

```
src/
  components/     # Shadcn + custom components
  features/       # Feature modules (envelopes, transactions, etc.)
  hooks/          # Custom React hooks
  lib/            # Supabase client, utilities
  stores/         # Zustand stores
  i18n/           # Translation files
  pages/          # Route components
```

## Data Model

### Tables

```sql
households
  id, name, created_at, owner_id

household_members
  id, household_id, user_id, role (admin/member), invited_email, status, joined_at

budget_periods
  id, household_id, year, month, total_income, created_at

envelopes
  id, household_id, name, emoji, color, sort_order, is_archived

envelope_allocations
  id, envelope_id, budget_period_id, allocated_amount, rollover_amount

transactions
  id, household_id, envelope_id, amount, description, merchant,
  date, created_by, created_at

user_preferences
  id, user_id, theme (light/dark/system), language, currency,
  onboarding_completed
```

### Key Decisions

- **Households** are the sharing boundary
- **Budget periods** are monthly with their own income and allocations
- **Rollover** tracked per envelope per period
- **Soft delete** via `is_archived` for historical data preservation
- **RLS policies** on all tables filtered by `household_id`

## Core Features

### Onboarding Flow

1. Sign up (email/password or Google OAuth)
2. Quick-start wizard: enter monthly income
3. Envelope templates offered (Essentials, Lifestyle, Savings)
4. Adjust allocations until zero-based (every dollar assigned)
5. Optional: Invite family members

### Main Dashboard

- Month selector at top
- Income bar: total → allocated → remaining
- Envelope cards grid with progress bars
- Quick-add transaction FAB
- Color-coded status (green/yellow/red)

### Transaction Entry

- Modal with amount, description, merchant, date
- Auto-suggests recent merchants
- Optimistic updates with background sync

### Budget Management

- Envelope detail view with transaction list
- Edit allocations mid-month
- End-of-month rollover review
- Archive unused envelopes

### Family Features

- Email invites with pending status
- Real-time sync for all members
- Transaction attribution ("Added by [name]")
- Admin can manage members

## Monetization

### Free Tier

- Unlimited envelopes and transactions
- Up to 2 household members
- Dark/light mode with auto-switching
- Full offline support
- 12 months transaction history
- All 20+ languages
- CSV data export

### Premium ($4.99/month or $39.99/year)

- Up to 6 household members
- Bank sync via Plaid
- Unlimited transaction history
- Advanced reports and trends
- Recurring transactions
- Envelope goals with target dates
- Priority support

### Implementation

- Feature flags in database
- Stripe for payments
- Webhook updates subscription status
- RLS checks subscription for premium features
- 14-day trial on signup

## Accessibility (WCAG 2.1 AA)

- Semantic HTML with proper landmarks
- Full keyboard navigation with visible focus
- Screen reader support via Radix ARIA
- 4.5:1 color contrast minimum
- Respects `prefers-reduced-motion`
- 44x44px minimum touch targets
- Live regions for dynamic updates

### Testing

- axe-core in CI
- Manual VoiceOver/TalkBack on key flows
- Keyboard-only testing during development

## Localization

### Languages (20+)

English, Spanish, French, German, Portuguese, Japanese, Chinese (Simplified), Korean, Italian, Dutch, Polish, Russian, Arabic (RTL), Hindi, Turkish, Vietnamese, Thai, Indonesian, Swedish, Norwegian

### Implementation

- react-i18next with lazy-loaded bundles
- `Intl.NumberFormat` for currency
- date-fns for date formatting
- CSS logical properties for RTL support

### Detection Priority

1. User preference (if logged in)
2. `navigator.language`
3. Manual override in settings

## Theming

### Modes

- Light, Dark, System (auto-switch via `prefers-color-scheme`)
- Stored in user preferences, synced across devices
- Tailwind `dark:` variant + CSS variables

### Color Palette

- Primary: Calming blue-green (trust)
- Success: Green (under budget)
- Warning: Amber (near limit)
- Danger: Red (over budget)
- All tested for contrast in both themes

## PWA Configuration

### Manifest

- App icons (192px, 512px)
- Display: standalone
- Theme colors for both modes

### Service Worker (Workbox)

- App shell: Cache-first
- API data: Network-first with fallback
- Static assets: Cache-first with versioning

### Updates

- Check on each visit
- Toast notification with refresh button
- Never force-refresh mid-session

## Error Handling

- **API errors**: React Query retry with backoff
- **Offline writes**: Queue in IndexedDB, sync when online
- **Sync conflicts**: Last-write-wins with timestamp
- **Auth errors**: Redirect to login, preserve destination
- **Validation**: Zod schemas with inline errors
- **Crashes**: Global error boundary with recovery

### Monitoring

- Sentry for error tracking
- Key event logging (no PII)

## Testing Strategy

| Type | Tool | Focus |
|------|------|-------|
| Unit | Vitest | Utilities, schemas, calculations |
| Component | React Testing Library | Key UI components |
| Integration | Playwright | Critical user flows |
| Accessibility | axe-core | WCAG compliance |

### CI/CD

- GitHub Actions: lint → type check → test → build → deploy
- Auto-deploy main to production
- Preview deployments for PRs

## Out of Scope (v1)

- Siri/Google Assistant (PWA limitation)
- Home screen widgets (PWA limitation)
- Native iOS/Android apps
- Investment tracking
- Bill reminders/notifications (v1.1 candidate)

## Feature Summary

| Feature | Tier |
|---------|------|
| Zero-based envelope budgeting | Free |
| Manual transaction entry | Free |
| Family sharing (up to 6) | Premium |
| Real-time sync | Free |
| Dark/light/system theme | Free |
| Onboarding wizard | Free |
| 20+ languages | Free |
| Accessibility (WCAG 2.1 AA) | Free |
| Offline support | Free |
| Bank sync (Plaid) | Premium |
| Reports & trends | Premium |
| Recurring transactions | Premium |
