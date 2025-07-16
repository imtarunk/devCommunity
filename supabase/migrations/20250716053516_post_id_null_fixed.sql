-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Set default on `id` column of posts table
alter table if exists public.posts
  alter column id set default gen_random_uuid();
