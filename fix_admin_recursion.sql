
-- FIX: 500 Internal Server Error (Infinite Recursion)

-- 1. Create a secure function to check admin status without triggering RLS
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- 2. Drop the buggy policies
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

-- 3. Re-create policies using the detailed secure function
create policy "Admins can view all profiles" 
  on public.profiles for select 
  using (public.is_admin());

create policy "Admins can update all profiles" 
  on public.profiles for update 
  using (public.is_admin());

-- Ensure the basic user policy still exists
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" 
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);
