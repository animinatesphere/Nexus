
-- Vault Items Table
create table if not exists public.vault_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  file_path text, -- path in supabase storage
  type text not null, -- image, document, note
  content text, -- for notes
  is_locked boolean default true,
  created_at timestamp with time zone default now()
);

-- Game Scores Table
create table if not exists public.game_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  game text not null, -- chess, whot
  score integer default 0,
  result text, -- won, lost, draw
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.vault_items enable row level security;
alter table public.game_scores enable row level security;

-- Policies
create policy "Users can view their own vault items" on public.vault_items for select using (auth.uid() = user_id);
create policy "Users can insert their own vault items" on public.vault_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own vault items" on public.vault_items for update using (auth.uid() = user_id);
create policy "Users can delete their own vault items" on public.vault_items for delete using (auth.uid() = user_id);

create policy "Users can view their own game scores" on public.game_scores for select using (auth.uid() = user_id);
create policy "Users can insert their own game scores" on public.game_scores for insert with check (auth.uid() = user_id);
