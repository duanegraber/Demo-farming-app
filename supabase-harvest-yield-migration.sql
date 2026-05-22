-- Demo Farm Manager harvest yield fields
-- Run this in Supabase SQL Editor to add harvest/yield tracking to field activities.

alter table public.field_activities
  add column if not exists yield_amount numeric(12, 2),
  add column if not exists yield_unit text not null default 'bushels',
  add column if not exists moisture numeric(6, 2),
  add column if not exists grade text not null default '',
  add column if not exists destination text not null default '';

create index if not exists field_activities_yield_unit_idx on public.field_activities (yield_unit);
