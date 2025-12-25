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
