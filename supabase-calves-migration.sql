-- Demo Farm Manager calves migration
-- Run this in Supabase SQL Editor if you already ran the first schema.

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

