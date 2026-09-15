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
  hackerrank_username text,
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
alter table teams add column if not exists hackerrank_username text;

-- ─── Registrations Table (All Participants: Leader + Members) ───
-- Every registered participant (Team Leader, Member 2, Member 3) has an individual row here.
create table if not exists registrations (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  member_order int not null default 1, -- 1: Team Leader, 2: Member 2, 3: Member 3
  role text not null default 'Member', -- 'Leader' or 'Member'
  member_name text not null,
  member_email text not null,
  member_phone text,
  member_ieee_member boolean default false,
  member_ieee_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist if table was already created
alter table registrations add column if not exists member_order int not null default 1;
alter table registrations add column if not exists role text not null default 'Member';
alter table registrations add column if not exists member_ieee_member boolean default false;
alter table registrations add column if not exists member_ieee_number text;

-- Drop legacy team_members table if it still exists
drop table if exists team_members cascade;

-- ─── Row Level Security (Defense in Depth) ───
-- Note: All mutations and queries are executed server-side using the Next.js backend API
-- with the Supabase Service Role Key (which bypasses RLS).
-- Direct public access via the Anon Key is disabled or strictly guarded to prevent
-- database scraping or unauthorized updates from browser bundles.
alter table teams enable row level security;
alter table registrations enable row level security;

-- Revoke all direct public client access by default
drop policy if exists "Anyone can register a team" on teams;
drop policy if exists "Anyone can read team by leader email" on teams;
drop policy if exists "Anyone can read teams" on teams;
drop policy if exists "Anyone can update teams" on teams;
drop policy if exists "Anyone can read registrations" on registrations;
drop policy if exists "Anyone can add registrations" on registrations;

-- If public anon access is ever queried directly, only non-sensitive columns should be visible
-- All authentication and registration operations proceed securely via server-side /api routes.

-- ─── Indexes ───
create index if not exists idx_teams_leader_email on teams(leader_email);
create index if not exists idx_teams_team_name on teams(team_name);
create index if not exists idx_teams_hackerrank_username on teams(hackerrank_username);
create index if not exists idx_registrations_team_id on registrations(team_id);
create index if not exists idx_registrations_email on registrations(member_email);
create index if not exists idx_registrations_role on registrations(role);

-- ─── Unique constraint on leader email (one team per leader) ───
create unique index if not exists idx_teams_leader_email_unique on teams(leader_email);

-- ─── Ensure Existing Team Leaders Are in registrations ───
insert into registrations (team_id, member_order, role, member_name, member_email, member_phone, member_ieee_member, member_ieee_number, created_at)
select id, 1, 'Leader', leader_name, leader_email, leader_phone, coalesce(leader_ieee_member, false), leader_ieee_number, created_at
from teams
where not exists (
  select 1 from registrations r where r.team_id = teams.id and r.member_order = 1
);
