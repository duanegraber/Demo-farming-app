-- Demo Farm Manager auth lockdown
-- Run this after login is working.
-- It changes MVP public read/write policies to authenticated-user-only policies.

alter table public.cows enable row level security;
alter table public.calves enable row level security;
alter table public.farm_events enable row level security;

drop policy if exists "MVP public read cows" on public.cows;
drop policy if exists "MVP public insert cows" on public.cows;
drop policy if exists "MVP public update cows" on public.cows;
drop policy if exists "Authenticated read cows" on public.cows;
drop policy if exists "Authenticated insert cows" on public.cows;
drop policy if exists "Authenticated update cows" on public.cows;

create policy "Authenticated read cows" on public.cows for select to authenticated using (true);
create policy "Authenticated insert cows" on public.cows for insert to authenticated with check (true);
create policy "Authenticated update cows" on public.cows for update to authenticated using (true) with check (true);

drop policy if exists "MVP public read calves" on public.calves;
drop policy if exists "MVP public insert calves" on public.calves;
drop policy if exists "MVP public update calves" on public.calves;
drop policy if exists "Authenticated read calves" on public.calves;
drop policy if exists "Authenticated insert calves" on public.calves;
drop policy if exists "Authenticated update calves" on public.calves;

create policy "Authenticated read calves" on public.calves for select to authenticated using (true);
create policy "Authenticated insert calves" on public.calves for insert to authenticated with check (true);
create policy "Authenticated update calves" on public.calves for update to authenticated using (true) with check (true);

drop policy if exists "MVP public read events" on public.farm_events;
drop policy if exists "MVP public insert events" on public.farm_events;
drop policy if exists "Authenticated read events" on public.farm_events;
drop policy if exists "Authenticated insert events" on public.farm_events;

create policy "Authenticated read events" on public.farm_events for select to authenticated using (true);
create policy "Authenticated insert events" on public.farm_events for insert to authenticated with check (true);


drop policy if exists "Authenticated delete cows" on public.cows;
create policy "Authenticated delete cows" on public.cows for delete to authenticated using (true);

drop policy if exists "Authenticated delete calves" on public.calves;
create policy "Authenticated delete calves" on public.calves for delete to authenticated using (true);

drop policy if exists "Authenticated delete events" on public.farm_events;
create policy "Authenticated delete events" on public.farm_events for delete to authenticated using (true);
