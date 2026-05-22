-- Demo Farm Manager pastures table
-- Run this in Supabase SQL Editor to let the app add pasture names on the go.

create table if not exists public.pastures (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  notes text not null default '',
  created_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pastures_name_idx on public.pastures (name);

alter table public.pastures enable row level security;

drop policy if exists "Authenticated read pastures" on public.pastures;
drop policy if exists "Authenticated insert pastures" on public.pastures;
drop policy if exists "Authenticated update pastures" on public.pastures;
drop policy if exists "Authenticated delete pastures" on public.pastures;

create policy "Authenticated read pastures" on public.pastures for select to authenticated using (true);
create policy "Authenticated insert pastures" on public.pastures for insert to authenticated with check (true);
create policy "Authenticated update pastures" on public.pastures for update to authenticated using (true) with check (true);
create policy "Authenticated delete pastures" on public.pastures for delete to authenticated using (true);

insert into public.pastures (name)
values ('North Quarter'), ('River Bend'), ('Yard Pasture'), ('South Lease')
on conflict (name) do nothing;
