-- Demo Farm Manager MVP schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.cows (
  id uuid primary key default gen_random_uuid(),
  tag text not null unique,
  status text not null default 'Active' check (status in ('Active', 'Watch', 'Sold', 'Dead', 'Culled')),
  color text not null default 'No description yet',
  location text not null default 'Not set',
  last_calved text not null default 'Not calved yet',
  calf_tag text,
  purchase_cost numeric(12, 2),
  date_bought text,
  selling_amount numeric(12, 2),
  date_sold text,
  notes text not null default 'No notes yet.',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.farm_events (
  id uuid primary key default gen_random_uuid(),
  cow_tag text,
  type text not null default 'Note',
  title text not null,
  detail text not null default '',
  user_name text not null default 'Sam',
  event_time timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists cows_tag_idx on public.cows (tag);
create index if not exists farm_events_cow_tag_idx on public.farm_events (cow_tag);
create index if not exists farm_events_event_time_idx on public.farm_events (event_time desc);

alter table public.cows enable row level security;
alter table public.farm_events enable row level security;

-- MVP policy: public anon app can read/write.
-- We will tighten this after login/user accounts are added.
drop policy if exists "MVP public read cows" on public.cows;
drop policy if exists "MVP public insert cows" on public.cows;
drop policy if exists "MVP public update cows" on public.cows;
drop policy if exists "MVP public read events" on public.farm_events;
drop policy if exists "MVP public insert events" on public.farm_events;

create policy "MVP public read cows" on public.cows for select using (true);
create policy "MVP public insert cows" on public.cows for insert with check (true);
create policy "MVP public update cows" on public.cows for update using (true) with check (true);
create policy "MVP public read events" on public.farm_events for select using (true);
create policy "MVP public insert events" on public.farm_events for insert with check (true);



-- Calves table added after initial MVP setup.
create table if not exists public.calves (
  id uuid primary key default gen_random_uuid(),
  tag text not null unique,
  cow_tag text not null,
  sex text not null default 'Unknown' check (sex in ('Bull', 'Heifer', 'Unknown')),
  born text not null default 'Unknown',
  status text not null default 'Active' check (status in ('Active', 'Sold', 'Dead', 'Kept back', 'Unknown')),
  notes text not null default '',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calves_tag_idx on public.calves (tag);
create index if not exists calves_cow_tag_idx on public.calves (cow_tag);

alter table public.calves enable row level security;

drop policy if exists "MVP public read calves" on public.calves;
drop policy if exists "MVP public insert calves" on public.calves;
drop policy if exists "MVP public update calves" on public.calves;

create policy "MVP public read calves" on public.calves for select using (true);
create policy "MVP public insert calves" on public.calves for insert with check (true);
create policy "MVP public update calves" on public.calves for update using (true) with check (true);



-- Bulls table for herd sire records.
create table if not exists public.bulls (
  id uuid primary key default gen_random_uuid(),
  tag text not null unique,
  name text not null default 'No name recorded',
  status text not null default 'Active' check (status in ('Active', 'Watch', 'Sold', 'Dead', 'Culled')),
  breed text not null default 'Not set',
  location text not null default 'Not set',
  purchase_cost numeric(12, 2),
  date_bought text,
  selling_amount numeric(12, 2),
  date_sold text,
  notes text not null default 'No notes yet.',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bulls_tag_idx on public.bulls (tag);
create index if not exists bulls_status_idx on public.bulls (status);

alter table public.bulls enable row level security;

drop policy if exists "Authenticated read bulls" on public.bulls;
drop policy if exists "Authenticated insert bulls" on public.bulls;
drop policy if exists "Authenticated update bulls" on public.bulls;
drop policy if exists "Authenticated delete bulls" on public.bulls;

create policy "Authenticated read bulls" on public.bulls for select to authenticated using (true);
create policy "Authenticated insert bulls" on public.bulls for insert to authenticated with check (true);
create policy "Authenticated update bulls" on public.bulls for update to authenticated using (true) with check (true);
create policy "Authenticated delete bulls" on public.bulls for delete to authenticated using (true);

-- Pastures table for editable pasture names.

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
