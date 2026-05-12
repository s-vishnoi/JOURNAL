create table if not exists public.habit_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.habit_data enable row level security;

drop policy if exists "habit_data_select_own" on public.habit_data;
drop policy if exists "habit_data_insert_own" on public.habit_data;
drop policy if exists "habit_data_update_own" on public.habit_data;
drop policy if exists "habit_data_delete_own" on public.habit_data;

create policy "habit_data_select_own"
  on public.habit_data
  for select
  using (auth.uid() = user_id);

create policy "habit_data_insert_own"
  on public.habit_data
  for insert
  with check (auth.uid() = user_id);

create policy "habit_data_update_own"
  on public.habit_data
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habit_data_delete_own"
  on public.habit_data
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_habit_data_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists habit_data_set_updated_at on public.habit_data;

create trigger habit_data_set_updated_at
before update on public.habit_data
for each row
execute function public.set_habit_data_updated_at();
