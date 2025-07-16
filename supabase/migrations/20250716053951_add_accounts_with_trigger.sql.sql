-- Create `accounts` table
create table if not exists public.accounts (
  id uuid primary key not null,
  email text,
  username text,
  bio text default '',
  avatar_url text default '',
  skills jsonb default '[]'::jsonb,
  posts jsonb
);

-- Enable RLS on accounts table
alter table if exists public.accounts enable row level security;

-- Policy: Allow user to read their own account
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Allow user to read own account' and tablename = 'accounts'
  ) then
    create policy "Allow user to read own account"
      on public.accounts
      as permissive
      for select
      to public
      using (auth.uid() = id);
  end if;
end$$;

-- Policy: Allow user to update their own account
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Allow user to update own account' and tablename = 'accounts'
  ) then
    create policy "Allow user to update own account"
      on public.accounts
      as permissive
      for update
      to public
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end$$;

-- Function: handle_new_user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.accounts (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger: on new auth.users row
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
