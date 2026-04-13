create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  stripe_account_id text,
  stripe_customer_id text,
  subscription_status text not null default 'free',
  charge_late_fee boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile"
on public.users
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert own profile"
on public.users
for insert
with check (auth.uid() = id);
