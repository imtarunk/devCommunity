-- Enable RLS on accounts table
alter table if exists public.accounts enable row level security;

-- Policy: Allow users to select their own account
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Select own account' and tablename = 'accounts'
  ) then
    create policy "Select own account"
      on public.accounts
      as permissive
      for select
      to authenticated
      using (auth.uid() = id);
  end if;
end$$;

-- Policy: Allow users to update their own account
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Update own account' and tablename = 'accounts'
  ) then
    create policy "Update own account"
      on public.accounts
      as permissive
      for update
      to authenticated
      using (auth.uid() = id);
  end if;
end$$;

-- Policy: Allow users to insert their own account (optional)
do $$
begin
  if not exists (
    select from pg_policies 
    where policyname = 'Insert own account' and tablename = 'accounts'
  ) then
    create policy "Insert own account"
      on public.accounts
      as permissive
      for insert
      to authenticated
      with check (auth.uid() = id);
  end if;
end$$;

-- Policy: Prevent delete by default (safer), but you can enable this:
-- do $$
-- begin
--   if not exists (
--     select from pg_policies 
--     where policyname = 'Delete own account' and tablename = 'accounts'
--   ) then
--     create policy "Delete own account"
--       on public.accounts
--       as permissive
--       for delete
--       to authenticated
--       using (auth.uid() = id);
--   end if;
-- end$$;
