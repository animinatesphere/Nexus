
-- Add is_admin column to profiles if it doesn't exist
alter table public.profiles 
add column if not exists is_admin boolean default false;

-- Create policy for Admin to view all profiles
create policy "Admins can view all profiles" 
  on public.profiles for select 
  using (auth.uid() in (select id from public.profiles where is_admin = true));

-- Create policy for Admin to update profiles (e.g. ban users)
create policy "Admins can update all profiles" 
  on public.profiles for update 
  using (auth.uid() in (select id from public.profiles where is_admin = true));

-- NOTE: You must manually update your own user to be an admin:
-- update public.profiles set is_admin = true where id = 'YOUR_USER_ID';
