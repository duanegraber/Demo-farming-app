-- Demo Farm Manager rented land cost tracking
-- Run this in Supabase SQL Editor to add rent cost per acre to field records.

alter table public.fields
  add column if not exists rent_cost_per_acre numeric(12, 2);

comment on column public.fields.rent_cost_per_acre is 'Annual rent cost per acre for rented fields.';
