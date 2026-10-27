-- Run in Supabase SQL Editor to enable admin-managed checkout discounts.

create table if not exists public.coupons (
  code text primary key check (code = upper(code) and code ~ '^[A-Z0-9_-]{3,30}$'),
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  minimum_order integer not null default 0 check (minimum_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint percent_discount_max check (discount_type <> 'percent' or discount_value <= 100)
);

alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists discount_amount integer not null default 0;
alter table public.orders add column if not exists email text;

alter table public.coupons enable row level security;

revoke all on public.coupons from anon, authenticated;
grant select on public.coupons to anon, authenticated;
grant insert, update, delete on public.coupons to authenticated;

drop policy if exists "Customers can read active discount codes" on public.coupons;
create policy "Customers can read active discount codes"
  on public.coupons
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Admins can manage discount codes" on public.coupons;
create policy "Admins can manage discount codes"
  on public.coupons
  for all
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into public.coupons (code, discount_type, discount_value, minimum_order)
values ('KARNAN10', 'percent', 10, 0)
on conflict (code) do nothing;
