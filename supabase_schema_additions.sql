
-- Profiles Table (for Premium Status)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  is_premium boolean default false,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Vault Items Table (Secret Folder)
create table public.vault_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'image', 'note', 'password'
  title text not null,
  content text not null, -- Encrypted content or URL
  created_at timestamp with time zone default now()
);

-- Game Scores Table
create table public.game_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  game_type text not null, -- 'chess', 'whot'
  score integer default 0,
  won boolean default false,
  played_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.vault_items enable row level security;
alter table public.game_scores enable row level security;

-- Policies
-- Profiles
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- Vault
create policy "Users can view their own vault items" on public.vault_items for select using (auth.uid() = user_id);
create policy "Users can insert their own vault items" on public.vault_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own vault items" on public.vault_items for update using (auth.uid() = user_id);
create policy "Users can delete their own vault items" on public.vault_items for delete using (auth.uid() = user_id);

-- Game Scores
create policy "Users can view their own scores" on public.game_scores for select using (auth.uid() = user_id);
create policy "Users can insert their own scores" on public.game_scores for insert with check (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, is_premium)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
