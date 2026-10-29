-- Run in Supabase SQL Editor to save public contact form submissions.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  mobile text not null check (char_length(btrim(mobile)) between 7 and 32),
  email text not null check (char_length(btrim(email)) between 3 and 254),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

revoke all on public.contact_messages from public, anon, authenticated;
grant insert (name, mobile, email, message) on public.contact_messages to anon, authenticated;
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
    and char_length(btrim(email)) between 3 and 254
    and char_length(btrim(message)) between 1 and 5000
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
