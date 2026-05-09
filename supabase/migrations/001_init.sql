-- ============================================================
-- P96 Culture House — WC2026 Portal
-- Run this in Supabase SQL editor: Dashboard → SQL Editor → New query
-- ============================================================

-- events table
create table if not exists events (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  title            text not null,
  description      text,
  type             text not null check (type in ('p96_wc', 'community', 'p96')),
  date             date not null,
  time             time,
  location_name    text,
  location_address text,
  flier_url        text,
  rsvp_url         text,
  additional_links jsonb,
  game_id          integer,
  is_published     boolean default false
);

-- intake table
create table if not exists intake (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email      text not null,
  country    text,
  borough    text
);

-- ============================================================
-- Row-level security
-- ============================================================

alter table events enable row level security;
alter table intake enable row level security;

-- Public can read published events
create policy "published events are public"
  on events for select
  using (is_published = true);

-- Authenticated users (admin) can do everything on events
create policy "admin full access on events"
  on events for all
  using (auth.role() = 'authenticated');

-- Anyone can insert intake (anon signups)
create policy "anyone can insert intake"
  on intake for insert
  with check (true);

-- Authenticated users can read intake
create policy "admin can read intake"
  on intake for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for fliers
-- ============================================================
-- Run separately or via Dashboard: Storage → New bucket → "fliers", public
-- insert into storage.buckets (id, name, public) values ('fliers', 'fliers', true);
