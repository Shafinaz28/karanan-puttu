-- Run in Supabase SQL Editor to save public contact form submissions.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  mobile text not null check (char_length(btrim(mobile)) between 7 and 32),
  email text check (email is null or char_length(btrim(email)) between 3 and 254),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  saree_type text not null default 'Not specified' check (char_length(btrim(saree_type)) between 1 and 120),
  saree_count integer not null default 1 check (saree_count between 1 and 1000),
  photo_paths text[] not null default '{}',
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages alter column email drop not null;
alter table public.contact_messages
  add column if not exists saree_type text not null default 'Not specified'
    check (char_length(btrim(saree_type)) between 1 and 120),
  add column if not exists saree_count integer not null default 1
    check (saree_count between 1 and 1000),
  add column if not exists photo_paths text[] not null default '{}';

alter table public.contact_messages enable row level security;

revoke all on public.contact_messages from public, anon, authenticated;
grant insert (name, mobile, email, message, saree_type, saree_count, photo_paths) on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;
grant update (status) on public.contact_messages to authenticated;

drop policy if exists "Anyone can submit a contact message" on public.contact_messages;
create policy "Anyone can submit a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 120
    and char_length(btrim(mobile)) between 7 and 32
    and (email is null or char_length(btrim(email)) between 3 and 254)
    and char_length(btrim(message)) between 1 and 5000
    and char_length(btrim(saree_type)) between 1 and 120
    and saree_count between 1 and 1000
    and cardinality(photo_paths) <= 5
    and status = 'New'
  );

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update contact message status" on public.contact_messages;
create policy "Admins can update contact message status"
  on public.contact_messages
  for update
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and status in ('New', 'Contacted', 'Closed')
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('contact-photos', 'contact-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = false,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Anyone can upload contact photos" on storage.objects;
create policy "Anyone can upload contact photos"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'contact-photos'
    and (storage.foldername(name))[1] = 'inquiries'
  );

drop policy if exists "Admins can view contact photos" on storage.objects;
create policy "Admins can view contact photos"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'contact-photos'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
