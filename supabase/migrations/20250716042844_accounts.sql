-- Migration: Create 'accounts' table if not exists
create table if not exists public.accounts (
  id uuid primary key,
  email text,
  username text,
  bio text,
  avatar_url text,
  posts jsonb,
  skills jsonb
);

-- Migration: Create 'posts' table if not exists
create table if not exists public.posts (
  id uuid primary key,
  content text,
  author_id uuid references public.accounts(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  edited boolean default false
);


-- Enable RLS on posts table
alter table if exists public.posts enable row level security;

-- Policy: Enable insert for users based on user_id
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Enable insert for users based on user_id' and tablename = 'posts'
  ) then
    create policy "Enable insert for users based on user_id"
      on public.posts
      as permissive
      for insert
      to anon, authenticated, supabase_admin
      with check ((auth.uid() = author_id));
  end if;
end$$;

-- Policy: Allow user to insert own posts
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Allow user to insert own posts' and tablename = 'posts'
  ) then
    create policy "Allow user to insert own posts"
      on public.posts
      as permissive
      for insert
      to public
      with check (author_id = auth.uid());
  end if;
end$$;

-- Policy: Users can insert their own posts
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Users can insert their own posts' and tablename = 'posts'
  ) then
    create policy "Users can insert their own posts"
      on public.posts
      as permissive
      for insert
      to public
      with check (author_id = auth.uid());
  end if;
end$$;

-- Policy: Allow user to view posts
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Allow user to view posts' and tablename = 'posts'
  ) then
    create policy "Allow user to view posts"
      on public.posts
      as permissive
      for select
      to public
      using (true);
  end if;
end$$;

-- Policy: Allow anyone to read posts
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Allow anyone to read posts' and tablename = 'posts'
  ) then
    create policy "Allow anyone to read posts"
      on public.posts
      as permissive
      for select
      to public
      using (author_id = auth.uid());
  end if;
end$$;

-- Policy: Allow public read
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Allow public read' and tablename = 'posts'
  ) then
    create policy "Allow public read"
      on public.posts
      as permissive
      for select
      to public
      using (true);
  end if;
end$$;

-- Policy: update own posts
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'update own posts' and tablename = 'posts'
  ) then
    create policy "update own posts"
      on public.posts
      as permissive
      for update
      to authenticated
      using (auth.uid() = author_id);
  end if;
end$$;
