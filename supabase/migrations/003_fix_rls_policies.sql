-- Fix RLS policies for household creation flow

-- Drop existing problematic policies
drop policy if exists "Users can view their households" on households;
drop policy if exists "Admins can invite members" on household_members;

-- Households: Allow owners to see their own households (regardless of membership)
create policy "Users can view their households"
  on households for select
  using (
    owner_id = auth.uid()
    or id in (select get_user_household_ids())
  );

-- Household members: Allow owners to add the first member (themselves)
create policy "Owners can add members to their households"
  on household_members for insert
  with check (
    -- Owner can add members
    household_id in (select id from households where owner_id = auth.uid())
    or
    -- Existing admins can add members
    household_id in (
      select household_id from household_members
      where user_id = auth.uid() and role = 'admin' and status = 'accepted'
    )
  );
