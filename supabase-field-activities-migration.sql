-- Demo Farm Manager field activities table
-- Run this in Supabase SQL Editor to enable farming activity logs.

create table if not exists public.field_activities (
  id uuid primary key default gen_random_uuid(),
  field_id uuid references public.fields(id) on delete set null,
  field_name text not null,
  type text not null default 'Other note' check (type in ('Seeding', 'Fertilizer', 'Spraying', 'Tillage', 'Irrigation', 'Harvest', 'Other note')),
  activity_date date not null default current_date,
  crop text not null default 'Not set',
  product text not null default '',
  rate text not null default '',
  acres numeric(12, 2),
  cost numeric(12, 2),
  notes text not null default 'No notes yet.',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists field_activities_field_id_idx on public.field_activities (field_id);
create index if not exists field_activities_field_name_idx on public.field_activities (field_name);
create index if not exists field_activities_type_idx on public.field_activities (type);
create index if not exists field_activities_activity_date_idx on public.field_activities (activity_date desc);

alter table public.field_activities enable row level security;

drop policy if exists "Authenticated read field activities" on public.field_activities;
drop policy if exists "Authenticated insert field activities" on public.field_activities;
drop policy if exists "Authenticated update field activities" on public.field_activities;
drop policy if exists "Authenticated delete field activities" on public.field_activities;

create policy "Authenticated read field activities" on public.field_activities for select to authenticated using (true);
create policy "Authenticated insert field activities" on public.field_activities for insert to authenticated with check (true);
create policy "Authenticated update field activities" on public.field_activities for update to authenticated using (true) with check (true);
create policy "Authenticated delete field activities" on public.field_activities for delete to authenticated using (true);
