-- Demo Farm Manager bulls table
-- Run this in Supabase SQL Editor to enable the Bull tab.

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
