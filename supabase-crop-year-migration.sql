-- Demo Farm Manager crop year fields
-- Run this in Supabase SQL Editor to separate farming records by crop year.

alter table public.field_activities
  add column if not exists crop_year integer;

alter table public.crop_sales
  add column if not exists crop_year integer;

update public.field_activities
set crop_year = extract(year from activity_date)::integer
where crop_year is null;

update public.crop_sales
set crop_year = extract(year from sale_date)::integer
where crop_year is null;

alter table public.field_activities
  alter column crop_year set default extract(year from current_date)::integer;

alter table public.crop_sales
  alter column crop_year set default extract(year from current_date)::integer;

create index if not exists field_activities_crop_year_idx on public.field_activities (crop_year);
create index if not exists crop_sales_crop_year_idx on public.crop_sales (crop_year);
