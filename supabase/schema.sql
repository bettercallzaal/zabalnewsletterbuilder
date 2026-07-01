-- ZABAL Newsletter Builder - cloud sync table
-- Run this in the Supabase SQL editor (project you point the app at).

create table if not exists public.newsletter_state (
  workspace   text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.newsletter_state enable row level security;

-- Low-stakes newsletter drafts, no auth. Anon can read + upsert its workspace row.
-- Tighten later (per-user auth) if this ever holds anything sensitive.
drop policy if exists "anon read newsletter_state" on public.newsletter_state;
create policy "anon read newsletter_state"
  on public.newsletter_state for select
  to anon using (true);

drop policy if exists "anon write newsletter_state" on public.newsletter_state;
create policy "anon write newsletter_state"
  on public.newsletter_state for insert
  to anon with check (true);

drop policy if exists "anon update newsletter_state" on public.newsletter_state;
create policy "anon update newsletter_state"
  on public.newsletter_state for update
  to anon using (true) with check (true);
