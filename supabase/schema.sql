-- ============================================================
-- Calendz — schéma Supabase complet
-- À exécuter dans Supabase : SQL Editor -> New query -> Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. WAITLIST (landing page publique)
-- ------------------------------------------------------------
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  status      text not null,
  pain_point  text,
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Insertion anonyme autorisée, lecture interdite côté front (anti-fuite des emails)
drop policy if exists "waitlist_anon_insert" on public.waitlist;
create policy "waitlist_anon_insert"
  on public.waitlist for insert to anon with check (true);

alter table public.waitlist drop constraint if exists waitlist_email_format;
alter table public.waitlist
  add constraint waitlist_email_format
  check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- ------------------------------------------------------------
-- 2. EVENTS (app calendrier — données privées par utilisateur)
-- ------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  source      text not null check (source in ('ecole', 'boulot', 'perso')),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  created_at  timestamptz not null default now(),
  constraint events_time_order check (ends_at > starts_at)
);

alter table public.events enable row level security;

-- Chaque utilisateur ne voit et ne gère QUE ses propres événements
drop policy if exists "events_select_own" on public.events;
create policy "events_select_own"
  on public.events for select to authenticated using (auth.uid() = user_id);

drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own"
  on public.events for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "events_update_own" on public.events;
create policy "events_update_own"
  on public.events for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own"
  on public.events for delete to authenticated using (auth.uid() = user_id);

create index if not exists events_user_time_idx
  on public.events (user_id, starts_at);
