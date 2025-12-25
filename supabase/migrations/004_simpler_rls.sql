-- Simplify RLS policies to use owner_id directly instead of membership

-- Drop all existing envelope/transaction policies that depend on get_user_household_ids
drop policy if exists "Users can view their envelopes" on envelopes;
drop policy if exists "Users can create envelopes" on envelopes;
drop policy if exists "Users can update envelopes" on envelopes;
drop policy if exists "Users can delete envelopes" on envelopes;

drop policy if exists "Users can view their transactions" on transactions;
drop policy if exists "Users can create transactions" on transactions;
drop policy if exists "Users can update transactions" on transactions;
drop policy if exists "Users can delete transactions" on transactions;

drop policy if exists "Users can view their budget periods" on budget_periods;
drop policy if exists "Users can create budget periods" on budget_periods;
drop policy if exists "Users can update budget periods" on budget_periods;

-- Helper function: get households where user is owner OR accepted member
create or replace function get_accessible_household_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select id from households where owner_id = auth.uid()
  union
  select household_id from household_members
  where user_id = auth.uid() and status = 'accepted'
$$;

-- Envelopes: simpler policies
create policy "Users can view their envelopes"
  on envelopes for select
  using (household_id in (select get_accessible_household_ids()));

create policy "Users can create envelopes"
  on envelopes for insert
  with check (household_id in (select get_accessible_household_ids()));

create policy "Users can update envelopes"
  on envelopes for update
  using (household_id in (select get_accessible_household_ids()));

create policy "Users can delete envelopes"
  on envelopes for delete
  using (household_id in (select get_accessible_household_ids()));

-- Transactions: simpler policies
create policy "Users can view their transactions"
  on transactions for select
  using (household_id in (select get_accessible_household_ids()));

create policy "Users can create transactions"
  on transactions for insert
  with check (household_id in (select get_accessible_household_ids()));

create policy "Users can update transactions"
  on transactions for update
  using (household_id in (select get_accessible_household_ids()));

create policy "Users can delete transactions"
  on transactions for delete
  using (household_id in (select get_accessible_household_ids()));

-- Budget periods: simpler policies
create policy "Users can view their budget periods"
  on budget_periods for select
  using (household_id in (select get_accessible_household_ids()));

create policy "Users can create budget periods"
  on budget_periods for insert
  with check (household_id in (select get_accessible_household_ids()));

create policy "Users can update budget periods"
  on budget_periods for update
  using (household_id in (select get_accessible_household_ids()));
