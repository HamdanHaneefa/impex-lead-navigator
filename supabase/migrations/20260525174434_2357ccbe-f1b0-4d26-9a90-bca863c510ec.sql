create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  environment text not null,
  display_size text not null,
  quantity text not null,
  timeline text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  organization text not null,
  city text,
  role text,
  notes text,
  source text default 'google-ads'
);

alter table public.leads enable row level security;

create policy "Anyone can submit a lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);
