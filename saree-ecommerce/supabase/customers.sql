-- Run after orders.sql. Customer data is only readable by authenticated admins.

create table if not exists public.customers (
  customer_key text primary key,
  customer text not null,
  email text,
  phone text,
  address text,
  city text,
  state text,
  pincode text,
  orders_count integer not null default 0,
  total_spent numeric not null default 0,
  last_order_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers enable row level security;

drop policy if exists "Signed-in staff can read customers" on public.customers;
create policy "Signed-in staff can read customers"
  on public.customers
  for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select on public.customers to authenticated;
revoke insert, update, delete on public.customers from anon, authenticated;

create or replace function public.customer_key_for(
  p_email text,
  p_phone text,
  p_order_id text
)
returns text
language sql
immutable
set search_path = pg_catalog
as $$
  select case
    when nullif(lower(btrim(coalesce(p_email, ''))), '') is not null
      then 'email:' || lower(btrim(p_email))
    when length(right(regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g'), 10)) = 10
      then 'phone:' || right(regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g'), 10)
    else 'order:' || coalesce(p_order_id, '')
  end;
$$;

create or replace function public.refresh_customer(p_customer_key text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.customers (
    customer_key, customer, email, phone, address, city, state, pincode,
    orders_count, total_spent, last_order_at, updated_at
  )
  with matching_orders as (
    select o.*
    from public.orders o
    where public.customer_key_for(o.email, o.phone, o.id) = p_customer_key
  ),
  latest_order as (
    select *
    from matching_orders
    order by created_at desc, id
    limit 1
  ),
  totals as (
    select
      count(*)::integer as orders_count,
      coalesce(sum(amount) filter (where status <> 'Cancelled'), 0) as total_spent,
      max(created_at) as last_order_at
    from matching_orders
  )
  select
    p_customer_key,
    latest_order.customer,
    latest_order.email,
    latest_order.phone,
    latest_order.address,
    latest_order.city,
    latest_order.state,
    latest_order.pincode,
    totals.orders_count,
    totals.total_spent,
    totals.last_order_at,
    now()
  from latest_order
  cross join totals
  on conflict (customer_key) do update
  set customer = excluded.customer,
      email = excluded.email,
      phone = excluded.phone,
      address = excluded.address,
      city = excluded.city,
      state = excluded.state,
      pincode = excluded.pincode,
      orders_count = excluded.orders_count,
      total_spent = excluded.total_spent,
      last_order_at = excluded.last_order_at,
      updated_at = excluded.updated_at;

  if not found then
    delete from public.customers where customer_key = p_customer_key;
  end if;
end;
$$;

revoke all on function public.refresh_customer(text) from public, anon, authenticated;

create or replace function public.sync_customer_from_order()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  old_customer_key text;
  new_customer_key text;
begin
  if tg_op = 'UPDATE' then
    old_customer_key := public.customer_key_for(old.email, old.phone, old.id);
  end if;
  if tg_op <> 'DELETE' then
    new_customer_key := public.customer_key_for(new.email, new.phone, new.id);
  end if;

  if old_customer_key is not null and old_customer_key is distinct from new_customer_key then
    perform public.refresh_customer(old_customer_key);
  end if;
  if new_customer_key is not null then
    perform public.refresh_customer(new_customer_key);
    return new;
  end if;
  return old;
end;
$$;

revoke all on function public.sync_customer_from_order() from public, anon, authenticated;

drop trigger if exists sync_customer_after_order_change on public.orders;
create trigger sync_customer_after_order_change
  after insert or update or delete on public.orders
  for each row execute function public.sync_customer_from_order();

do $$
declare
  customer_key text;
begin
  for customer_key in
    select distinct public.customer_key_for(email, phone, id)
    from public.orders
  loop
    perform public.refresh_customer(customer_key);
  end loop;
end;
$$;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'customers'
    )
  then
    alter publication supabase_realtime add table public.customers;
  end if;
end;
$$;
