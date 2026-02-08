
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  status text default 'active', -- active, archived
  created_at timestamp with time zone default now()
);

-- Tasks Table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects on delete cascade,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text default 'todo', -- todo, in_progress, done
  priority text default 'medium', -- low, medium, high
  due_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Time Entries Table
create table public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks on delete cascade,
  user_id uuid references auth.users not null,
  start_time timestamp with time zone default now(),
  end_time timestamp with time zone,
  duration integer, -- in seconds
  created_at timestamp with time zone default now()
);

-- Transactions Table (Finance)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  type text not null, -- income, expense
  category text not null,
  description text,
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Vault Items Table
create table public.vault_items (
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
create table public.game_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  game text not null, -- chess, whot
  score integer default 0,
  result text, -- won, lost, draw
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.time_entries enable row level security;
alter table public.transactions enable row level security;
alter table public.vault_items enable row level security;
alter table public.game_scores enable row level security;

-- Create Policies (Existing + New)
-- ... (Previous policies kept implicitly, listing all for completeness/copy-paste)

-- Policies for Projects, Tasks, Time Entries, Transactions...
create policy "Users can view their own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert their own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update their own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete their own projects" on public.projects for delete using (auth.uid() = user_id);

create policy "Users can view their own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on public.tasks for delete using (auth.uid() = user_id);

create policy "Users can view their own time entries" on public.time_entries for select using (auth.uid() = user_id);
create policy "Users can insert their own time entries" on public.time_entries for insert with check (auth.uid() = user_id);
create policy "Users can update their own time entries" on public.time_entries for update using (auth.uid() = user_id);

create policy "Users can view their own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update their own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete their own transactions" on public.transactions for delete using (auth.uid() = user_id);

-- Policies for Vault Items
create policy "Users can view their own vault items" on public.vault_items for select using (auth.uid() = user_id);
create policy "Users can insert their own vault items" on public.vault_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own vault items" on public.vault_items for update using (auth.uid() = user_id);
create policy "Users can delete their own vault items" on public.vault_items for delete using (auth.uid() = user_id);

-- Policies for Game Scores
create policy "Users can view their own game scores" on public.game_scores for select using (auth.uid() = user_id);
create policy "Users can insert their own game scores" on public.game_scores for insert with check (auth.uid() = user_id);
