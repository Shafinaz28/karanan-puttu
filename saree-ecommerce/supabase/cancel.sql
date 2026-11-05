-- Run after orders.sql in the Supabase SQL Editor.

alter table public.orders add column if not exists cancelled_at timestamptz;
alter table public.orders add column if not exists cancel_reason text;
alter table public.orders add column if not exists cancel_note text;

create table if not exists public.cancelled_orders (
  like public.orders including defaults including constraints
);

create unique index if not exists cancelled_orders_id_key
  on public.cancelled_orders (id);

alter table public.cancelled_orders enable row level security;

drop policy if exists "Signed-in staff can read cancelled orders" on public.cancelled_orders;
create policy "Signed-in staff can read cancelled orders"
  on public.cancelled_orders
  for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select on public.cancelled_orders to authenticated;
revoke insert, update, delete on public.cancelled_orders from anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
    ) then
      alter publication supabase_realtime add table public.orders;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cancelled_orders'
    ) then
      alter publication supabase_realtime add table public.cancelled_orders;
    end if;
  end if;
end;
$$;

insert into public.cancelled_orders
select *
from public.orders
where status = 'Cancelled'
on conflict (id) do nothing;

create or replace function public.cancel_order_record(
  p_order_id text,
  p_phone text,
  p_reason text default '',
  p_note text default '',
  p_admin boolean default false
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  phone_digits text := right(regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g'), 10);
  updated_id text;
begin
  if p_admin then
    if (select auth.jwt() -> 'app_metadata' ->> 'role') is distinct from 'admin' then
      raise exception 'Admin access required to cancel this order.';
    end if;
  elsif length(phone_digits) <> 10 then
    return null;
  end if;

  update public.orders
  set status = 'Cancelled',
      cancelled_at = now(),
      cancel_reason = nullif(left(coalesce(p_reason, ''), 200), ''),
      cancel_note = nullif(left(coalesce(p_note, ''), 1000), '')
  where id = p_order_id
    and (p_admin or right(regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g'), 10) = phone_digits)
    and status in ('Pending', 'Processing')
  returning id into updated_id;

  if updated_id is null then
    return null;
  end if;

  insert into public.cancelled_orders
  select *
  from public.orders
  where id = updated_id
  on conflict (id) do update
  set status = excluded.status,
      cancelled_at = excluded.cancelled_at,
      cancel_reason = excluded.cancel_reason,
      cancel_note = excluded.cancel_note;

  return updated_id;
end;
$$;

revoke all on function public.cancel_order_record(text, text, text, text, boolean) from public, anon, authenticated;

create or replace function public.cancel_order(
  p_order_id text,
  p_phone text,
  p_reason text default '',
  p_note text default ''
)
returns boolean
language sql
security definer
set search_path = pg_catalog, public
as $$
  select public.cancel_order_record(p_order_id, p_phone, p_reason, p_note, false) is not null;
$$;

create or replace function public.admin_cancel_order(
  p_order_id text,
  p_reason text default '',
  p_note text default ''
)
returns boolean
language sql
security definer
set search_path = pg_catalog, public
as $$
  select public.cancel_order_record(p_order_id, null, p_reason, p_note, true) is not null;
$$;

revoke all on function public.cancel_order(text, text, text, text) from public;
grant execute on function public.cancel_order(text, text, text, text) to anon, authenticated;
revoke all on function public.admin_cancel_order(text, text, text) from public;
grant execute on function public.admin_cancel_order(text, text, text) to authenticated;
