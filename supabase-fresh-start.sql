-- Demo Farm Manager fresh start cleanup
-- Run this in Supabase SQL Editor before entering real farm data.

-- Allow authenticated app users to delete records from the MVP tables.
alter table public.cows enable row level security;
alter table public.calves enable row level security;
alter table public.farm_events enable row level security;

drop policy if exists "Authenticated delete cows" on public.cows;
drop policy if exists "Authenticated delete calves" on public.calves;
drop policy if exists "Authenticated delete events" on public.farm_events;

create policy "Authenticated delete cows" on public.cows for delete to authenticated using (true);
create policy "Authenticated delete calves" on public.calves for delete to authenticated using (true);
create policy "Authenticated delete events" on public.farm_events for delete to authenticated using (true);

-- Remove the original sample rows from first setup.
-- Delete children/activity before cows.
delete from public.farm_events;
delete from public.calves;
delete from public.cows;
