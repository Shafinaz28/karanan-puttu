-- Run once in the Supabase SQL Editor so occasion saves on its own column.
alter table public.products add column if not exists occasion text;
