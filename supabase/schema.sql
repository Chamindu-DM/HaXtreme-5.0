-- ============================================================
-- HaXtreme 5.0 — Registration & Photobooth Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Teams Table ───
create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  team_name text unique not null,
  leader_name text not null,
  leader_email text not null,
  leader_phone text not null,
  institution text not null,
  -- Status values:
  --   'registered'  → initial registration
  --   'qualified'   → completed at least one online round task (unlocks photobooth)
  --   'finalist'    → selected for final round (also unlocks photobooth)
  status text not null default 'registered',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── Team Members Table ───
create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  member_name text not null,
  member_email text not null,
  member_phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── Row Level Security ───
alter table teams enable row level security;
alter table team_members enable row level security;

-- Allow anyone to INSERT new teams (public registration)
create policy "Anyone can register a team"
  on teams for insert
  with check (true);

-- Allow anyone to read their own team by email (for photobooth verification)
create policy "Anyone can read team by leader email"
  on teams for select
  using (true);

-- Allow anyone to INSERT team members (during registration)
create policy "Anyone can add team members"
  on team_members for insert
  with check (true);

-- Allow reading team members for associated teams
create policy "Anyone can read team members"
  on team_members for select
  using (true);

-- ─── Indexes ───
create index if not exists idx_teams_leader_email on teams(leader_email);
create index if not exists idx_teams_team_name on teams(team_name);
create index if not exists idx_team_members_team_id on team_members(team_id);

-- ─── Unique constraint on leader email (one team per leader) ───
create unique index if not exists idx_teams_leader_email_unique on teams(leader_email);
