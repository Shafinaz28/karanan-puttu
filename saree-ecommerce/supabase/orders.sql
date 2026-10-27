-- Run once in Supabase SQL Editor. Does not touch the products table.

create table if not exists public.orders (
  id text primary key,
  customer text not null,
  email text,
  phone text,
  address text,
  city text,
  pincode text,
  amount integer not null,
  status text not null default 'Pending',
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists state text;
alter table public.orders add column if not exists payment text default 'Cash on delivery';
alter table public.orders add column if not exists email text;
alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists discount_amount integer not null default 0;

alter table public.orders enable row level security;

drop policy if exists "Shoppers can place an order" on public.orders;
create policy "Shoppers can place an order"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Signed-in staff can read orders" on public.orders;
create policy "Signed-in staff can read orders"
  on public.orders
  for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Signed-in staff can update orders" on public.orders;
create policy "Signed-in staff can update orders"
  on public.orders
  for update
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
