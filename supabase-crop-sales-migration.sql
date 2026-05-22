-- Demo Farm Manager crop sales table
-- Run this in Supabase SQL Editor to enable crop revenue/profit tracking.

create table if not exists public.crop_sales (
  id uuid primary key default gen_random_uuid(),
  field_id uuid references public.fields(id) on delete set null,
  field_name text not null,
  crop text not null default 'Not set',
  sale_date date not null default current_date,
  amount numeric(12, 2),
  unit text not null default 'bushels',
  price_per_unit numeric(12, 4),
  gross_revenue numeric(12, 2),
  deductions numeric(12, 2) not null default 0,
  net_revenue numeric(12, 2),
  buyer text not null default '',
  notes text not null default 'No notes yet.',
  created_by text not null default 'Alex',
  updated_by text not null default 'Alex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crop_sales_field_id_idx on public.crop_sales (field_id);
create index if not exists crop_sales_field_name_idx on public.crop_sales (field_name);
create index if not exists crop_sales_crop_idx on public.crop_sales (crop);
create index if not exists crop_sales_sale_date_idx on public.crop_sales (sale_date desc);

alter table public.crop_sales enable row level security;

drop policy if exists "Authenticated read crop sales" on public.crop_sales;
drop policy if exists "Authenticated insert crop sales" on public.crop_sales;
drop policy if exists "Authenticated update crop sales" on public.crop_sales;
drop policy if exists "Authenticated delete crop sales" on public.crop_sales;

create policy "Authenticated read crop sales" on public.crop_sales for select to authenticated using (true);
create policy "Authenticated insert crop sales" on public.crop_sales for insert to authenticated with check (true);
create policy "Authenticated update crop sales" on public.crop_sales for update to authenticated using (true) with check (true);
create policy "Authenticated delete crop sales" on public.crop_sales for delete to authenticated using (true);
