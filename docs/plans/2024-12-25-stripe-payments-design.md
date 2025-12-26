# Debtanator Premium Payments - Design Document

## Overview

Add Stripe subscription payments to Debtanator with a 14-day free trial for all new users, monthly ($4.99) and yearly ($39.99) pricing options.

## Architecture

- **Backend**: Supabase Edge Functions (Deno)
- **Payments**: Stripe Checkout + Customer Portal
- **Database**: PostgreSQL subscriptions table with RLS

## Database Schema

```sql
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text check (status in ('trialing', 'active', 'canceled', 'past_due', 'unpaid')) not null,
  price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  trial_ends_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table subscriptions enable row level security;

create policy "Users can view own subscription"
  on subscriptions for select using (user_id = auth.uid());
```

## Supabase Edge Functions

### 1. create-checkout-session
- Creates Stripe customer if needed
- Creates Checkout session with selected plan
- Returns checkout URL

### 2. stripe-webhook
- Handles: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed
- Updates subscriptions table
- Verifies webhook signature

### 3. create-portal-session
- Creates Stripe Customer Portal session
- User manages subscription, payment methods, invoices

## Frontend Components

1. **useSubscription hook** - Fetches status, provides isPremium, isTrialing, daysLeftInTrial
2. **PricingCard** - Monthly/yearly toggle with savings highlight
3. **UpgradeButton** - Calls create-checkout-session, redirects to Stripe
4. **SubscriptionBanner** - Trial countdown or upgrade prompt
5. **PremiumGate** - Wraps premium features, shows upgrade if not premium

## Environment Variables

### Frontend (.env.local)
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SiQG4Lawnz98SJgRCjPLP3xPm22SJrhcjrQDBOkq0l4sScN9mDgMqhfdwIGw22u4U5LvbuT8zXyKprlesu24nZL002mHbJEqc
```

### Supabase Edge Function Secrets
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_1SiQglLawnz98SJgFsc39lr8
STRIPE_YEARLY_PRICE_ID=price_1SiQhOLawnz98SJgM5VOh72o
```

## Pricing

- Monthly: $4.99/month
- Yearly: $39.99/year (17% savings)
- 14-day free trial on signup

## Premium Features

- Up to 6 household members (free: 2)
- Bank sync via Plaid (future)
- Unlimited transaction history (free: 12 months)
- Advanced reports and trends (future)
- Recurring transactions (future)
- Envelope goals with target dates (future)

## User Flow

1. User signs up → Auto-created subscription with status='trialing', trial_ends_at=14 days
2. Trial banner shows countdown
3. User clicks Upgrade → Stripe Checkout → Payment → Webhook updates status='active'
4. User clicks Manage → Stripe Portal → Can cancel/update payment
5. Trial expires without payment → status='canceled', features gated
