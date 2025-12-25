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
