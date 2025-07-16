create table public.accounts (
  id uuid primary key,
  email text,
  username text,
  bio text,
  avatar_url text,
  posts jsonb,
  skills jsonb
);

create table public.posts (
  id uuid primary key,
  content text,
  author_id uuid references public.accounts(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  edited boolean default false
);
-- (Add RLS and policies if needed)
