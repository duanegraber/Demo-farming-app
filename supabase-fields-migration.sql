-- Demo Farm Manager fields table
-- Run this in Supabase SQL Editor to enable the farming Fields tab.

create table if not exists public.fields (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  acres numeric(12, 2),
  ownership text not null default 'Owned' check (ownership in ('Owned', 'Rented', 'Custom', 'Other')),
  rent_cost_per_acre numeric(12, 2),
  current_crop text not null default 'Not set',
  legal_location text not null default 'Not recorded',
  notes text not null default 'No notes yet.',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fields_name_idx on public.fields (name);
create index if not exists fields_current_crop_idx on public.fields (current_crop);
create index if not exists fields_ownership_idx on public.fields (ownership);

alter table public.fields enable row level security;

drop policy if exists "Authenticated read fields" on public.fields;
drop policy if exists "Authenticated insert fields" on public.fields;
drop policy if exists "Authenticated update fields" on public.fields;
drop policy if exists "Authenticated delete fields" on public.fields;

create policy "Authenticated read fields" on public.fields for select to authenticated using (true);
create policy "Authenticated insert fields" on public.fields for insert to authenticated with check (true);
create policy "Authenticated update fields" on public.fields for update to authenticated using (true) with check (true);
create policy "Authenticated delete fields" on public.fields for delete to authenticated using (true);
