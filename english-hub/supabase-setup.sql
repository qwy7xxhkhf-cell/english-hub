-- ============================================================
-- English Hub — Supabase Setup
-- 在 Supabase → SQL Editor 執行此文件
-- ============================================================

-- 1. Progress table (mastered + reps for sentences & verbs)
create table if not exists progress (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users on delete cascade not null,
  key        text not null,           -- e.g. "s_123" or "v_give_up_1"
  mastered   boolean default false,
  reps       integer default 0,
  updated_at timestamp with time zone default now(),
  unique(user_id, key)
);

-- 2. Study log
create table if not exists study_log (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references auth.users on delete cascade not null,
  date              date not null,
  island            text default '',
  sentences_studied integer default 0,
  mastered_today    integer default 0,
  time_spent        integer default 0,
  mood              text default '😊 Great',
  streak_day        integer default 0,
  notes             text default '',
  created_at        timestamp with time zone default now(),
  unique(user_id, date)
);

-- 3. User stats (streak etc.)
create table if not exists user_stats (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references auth.users on delete cascade not null unique,
  streak          integer default 0,
  longest_streak  integer default 0,
  last_study_date date,
  updated_at      timestamp with time zone default now()
);

-- ── Row Level Security ───────────────────────────────────────
alter table progress    enable row level security;
alter table study_log   enable row level security;
alter table user_stats  enable row level security;

-- Users can only read/write their own data
create policy "Own progress" on progress    for all using (auth.uid() = user_id);
create policy "Own logs"     on study_log   for all using (auth.uid() = user_id);
create policy "Own stats"    on user_stats  for all using (auth.uid() = user_id);

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists idx_progress_user  on progress(user_id);
create index if not exists idx_studylog_user  on study_log(user_id);
create index if not exists idx_studylog_date  on study_log(user_id, date desc);
