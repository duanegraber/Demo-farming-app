-- Demo Farm Manager equipment tracking
-- Run this in Supabase SQL Editor to enable equipment records and yearly equipment cost logs.

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null default 'Other',
  status text not null default 'Active',
  identifier text not null default '',
  current_meter numeric(12, 1),
  meter_unit text not null default 'hours' check (meter_unit in ('hours', 'km', 'miles')),
  notes text not null default 'No notes yet.',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.equipment_logs (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.equipment(id) on delete set null,
  equipment_name text not null,
  type text not null default 'Maintenance' check (type in ('Maintenance', 'Repair', 'Fuel', 'Inspection', 'Note')),
  log_date date not null default current_date,
  log_year integer not null default extract(year from current_date)::integer,
  vendor text not null default '',
  description text not null default 'Equipment log',
  meter_reading numeric(12, 1),
  fuel_amount numeric(12, 2),
  fuel_unit text not null default 'litres' check (fuel_unit in ('litres', 'gallons')),
  cost numeric(12, 2),
  notes text not null default 'No notes yet.',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists equipment_name_idx on public.equipment (name);
create index if not exists equipment_type_idx on public.equipment (type);
create index if not exists equipment_status_idx on public.equipment (status);
create index if not exists equipment_logs_equipment_id_idx on public.equipment_logs (equipment_id);
create index if not exists equipment_logs_log_year_idx on public.equipment_logs (log_year);
create index if not exists equipment_logs_type_idx on public.equipment_logs (type);
create index if not exists equipment_logs_log_date_idx on public.equipment_logs (log_date desc);

alter table public.equipment enable row level security;
alter table public.equipment_logs enable row level security;

drop policy if exists "Authenticated read equipment" on public.equipment;
drop policy if exists "Authenticated insert equipment" on public.equipment;
drop policy if exists "Authenticated update equipment" on public.equipment;
drop policy if exists "Authenticated delete equipment" on public.equipment;
drop policy if exists "Authenticated read equipment logs" on public.equipment_logs;
drop policy if exists "Authenticated insert equipment logs" on public.equipment_logs;
drop policy if exists "Authenticated update equipment logs" on public.equipment_logs;
drop policy if exists "Authenticated delete equipment logs" on public.equipment_logs;

create policy "Authenticated read equipment" on public.equipment for select to authenticated using (true);
create policy "Authenticated insert equipment" on public.equipment for insert to authenticated with check (true);
create policy "Authenticated update equipment" on public.equipment for update to authenticated using (true) with check (true);
create policy "Authenticated delete equipment" on public.equipment for delete to authenticated using (true);
create policy "Authenticated read equipment logs" on public.equipment_logs for select to authenticated using (true);
create policy "Authenticated insert equipment logs" on public.equipment_logs for insert to authenticated with check (true);
create policy "Authenticated update equipment logs" on public.equipment_logs for update to authenticated using (true) with check (true);
create policy "Authenticated delete equipment logs" on public.equipment_logs for delete to authenticated using (true);
