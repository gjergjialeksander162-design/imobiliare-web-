-- Skema për Supabase (Postgres). Ekzekutoje në SQL Editor të projektit.

create extension if not exists "pgcrypto";

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text default '',
  price numeric not null check (price >= 0),
  deal text not null check (deal in ('shitje', 'qira')),
  kind text not null check (kind in ('apartament', 'shtepi', 'vile', 'truall', 'lokal', 'zyre')),
  city text not null,
  address text default '',
  rooms int default 0,
  baths int default 0,
  area numeric default 0,
  floor int,
  year int,
  features text[] default '{}',
  images text[] default '{}',
  lat double precision,
  lng double precision,
  featured boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists properties_city_idx on public.properties (city);
create index if not exists properties_deal_kind_idx on public.properties (deal, kind);
create index if not exists properties_price_idx on public.properties (price);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties (id) on delete set null,
  name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.properties enable row level security;
alter table public.inquiries enable row level security;

-- Listimet lexohen publikisht; shkrimi bëhet vetëm me service role key (server-side).
drop policy if exists "properties are public" on public.properties;
create policy "properties are public" on public.properties for select using (true);

-- Kërkesat e klientëve mund të krijohen nga publiku, por lexohen vetëm nga service role.
drop policy if exists "inquiries insert public" on public.inquiries;
create policy "inquiries insert public" on public.inquiries for insert with check (true);

-- Storage bucket publik për fotot e pronave.
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;
