-- Fix envelope_allocations RLS policies

drop policy if exists "Users can view their allocations" on envelope_allocations;
drop policy if exists "Users can create allocations" on envelope_allocations;
drop policy if exists "Users can update allocations" on envelope_allocations;

-- Envelope allocations: use the accessible households function
create policy "Users can view their allocations"
  on envelope_allocations for select
  using (
    envelope_id in (
      select id from envelopes
      where household_id in (select get_accessible_household_ids())
    )
  );

create policy "Users can create allocations"
  on envelope_allocations for insert
  with check (
    envelope_id in (
      select id from envelopes
      where household_id in (select get_accessible_household_ids())
    )
  );

create policy "Users can update allocations"
  on envelope_allocations for update
  using (
    envelope_id in (
      select id from envelopes
      where household_id in (select get_accessible_household_ids())
    )
  );

create policy "Users can delete allocations"
  on envelope_allocations for delete
  using (
    envelope_id in (
      select id from envelopes
      where household_id in (select get_accessible_household_ids())
    )
  );
