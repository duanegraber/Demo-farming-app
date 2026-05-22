-- Demo Farm Manager cow financial fields
-- Run this in Supabase SQL Editor so purchase/sale fields save to the database.

alter table public.cows
  add column if not exists purchase_cost numeric(12, 2),
  add column if not exists date_bought text,
  add column if not exists selling_amount numeric(12, 2),
  add column if not exists date_sold text;
