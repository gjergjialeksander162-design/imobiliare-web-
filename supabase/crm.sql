-- Skema CRM për Supabase (Postgres). Ekzekutoje në SQL Editor të projektit.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text default '',
  email text default '',
  source text not null default 'web',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  status text not null default 'i_re',
  deal text,
  kind text,
  city text default '',
  budget_min numeric,
  budget_max numeric,
  min_rooms int,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  type text not null default 'shenim',
  note text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null,
  due_at timestamptz,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_client_idx on public.leads (client_id);
create index if not exists activities_lead_idx on public.activities (lead_id);
create index if not exists crm_tasks_lead_idx on public.crm_tasks (lead_id);

-- Të dhënat e CRM-it lexohen/shkruhen vetëm nga serveri me service role key.
alter table public.clients enable row level security;
alter table public.leads enable row level security;
alter table public.activities enable row level security;
alter table public.crm_tasks enable row level security;
