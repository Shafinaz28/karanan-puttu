-- Run in Supabase SQL Editor to store customer names separately from Auth credentials.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default 'Customer',
  email text,
  phone text,
  account_type text not null default 'customer' check (account_type in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists account_type text not null default 'customer';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_account_type_check'
  ) then
    alter table public.profiles
      add constraint profiles_account_type_check
      check (account_type in ('customer', 'admin'));
  end if;
end;
$$;

alter table public.profiles enable row level security;

revoke all on public.profiles from anon;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Admins can read customer profiles" on public.profiles;
create policy "Admins can read customer profiles"
  on public.profiles
  for select
  to authenticated
  using (
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and account_type = 'customer'
  );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, account_type, created_at, updated_at)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), 'Customer'),
    new.email,
    coalesce(nullif(btrim(new.phone), ''), nullif(btrim(new.raw_user_meta_data ->> 'phone'), '')),
    case when new.raw_app_meta_data ->> 'role' = 'admin' then 'admin' else 'customer' end,
    new.created_at,
    now()
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      phone = excluded.phone,
      account_type = excluded.account_type,
      updated_at = excluded.updated_at;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email, phone, raw_user_meta_data, raw_app_meta_data on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.profiles (id, full_name, email, phone, account_type, created_at, updated_at)
select
  id,
  coalesce(
    nullif(btrim(raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(coalesce(email, ''), '@', 1), ''),
    'Customer'
  ),
  email,
  coalesce(nullif(btrim(phone), ''), nullif(btrim(raw_user_meta_data ->> 'phone'), '')),
  case when raw_app_meta_data ->> 'role' = 'admin' then 'admin' else 'customer' end,
  created_at,
  now()
from auth.users
on conflict (id) do update
set full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    account_type = excluded.account_type,
    updated_at = excluded.updated_at;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'profiles'
    )
  then
    alter publication supabase_realtime add table public.profiles;
  end if;
end;
$$;

-- Customer sessions must not inherit the existing staff-only data permissions.
drop policy if exists "Authenticated can manage products" on public.products;
create policy "Authenticated can manage products"
  on public.products
  for all
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

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

drop policy if exists "Signed-in staff can upload product images" on storage.objects;
create policy "Signed-in staff can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Signed-in staff can replace product images" on storage.objects;
create policy "Signed-in staff can replace product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'product-images'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
