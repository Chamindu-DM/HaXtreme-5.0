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
  category text not null default 'University', -- 'University' or 'School'
  institution text not null,
  leader_name text not null,
  leader_email text not null,
  leader_phone text not null,
  leader_ieee_member boolean default false,
  leader_ieee_number text,
  password_hash text,
  -- Status values:
  --   'registered'  → initial registration
  --   'qualified'   → completed at least one online round task (unlocks photobooth)
  --   'finalist'    → selected for final round (also unlocks photobooth)
  status text not null default 'registered',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist if table was already created
alter table teams add column if not exists category text not null default 'University';
alter table teams add column if not exists leader_ieee_member boolean default false;
alter table teams add column if not exists leader_ieee_number text;
alter table teams add column if not exists password_hash text;

-- ─── Team Members Table ───
create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  member_order int not null default 2, -- 2 for Member 2, 3 for Member 3
  member_name text not null,
  member_email text not null,
  member_phone text,
  member_ieee_member boolean default false,
  member_ieee_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist if table was already created
alter table team_members add column if not exists member_order int not null default 2;
alter table team_members add column if not exists member_ieee_member boolean default false;
alter table team_members add column if not exists member_ieee_number text;

-- ─── Row Level Security ───
alter table teams enable row level security;
alter table team_members enable row level security;

-- Allow anyone to INSERT new teams (public registration)
drop policy if exists "Anyone can register a team" on teams;
create policy "Anyone can register a team"
  on teams for insert
  with check (true);

-- Allow anyone to read team (for sign in and photobooth verification)
drop policy if exists "Anyone can read team by leader email" on teams;
drop policy if exists "Anyone can read teams" on teams;
create policy "Anyone can read teams"
  on teams for select
  using (true);

-- Allow anyone to INSERT team members (during registration)
drop policy if exists "Anyone can add team members" on team_members;
create policy "Anyone can add team members"
  on team_members for insert
  with check (true);

-- Allow reading team members for associated teams
drop policy if exists "Anyone can read team members" on team_members;
create policy "Anyone can read team members"
  on team_members for select
  using (true);

-- ─── Indexes ───
create index if not exists idx_teams_leader_email on teams(leader_email);
create index if not exists idx_teams_team_name on teams(team_name);
create index if not exists idx_team_members_team_id on team_members(team_id);
create index if not exists idx_team_members_email on team_members(member_email);

-- ─── Unique constraint on leader email (one team per leader) ───
create unique index if not exists idx_teams_leader_email_unique on teams(leader_email);
