-- MWRPG — schema de contas + persistência de campanha (Fase 2)
-- Rodar UMA VEZ no SQL Editor do painel do Supabase (projeto do Tiago).
-- Auth de usuário já vem pronta do Supabase (tabela auth.users) — aqui
-- só criamos o que é específico do jogo.

create extension if not exists pgcrypto;

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  data jsonb not null,              -- espelha o formato de MWRPG_DATA.player (hp, mp, atributos, tags)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id uuid references public.characters(id) on delete set null,
  scenario_id text not null default 'ys',
  messages jsonb not null default '[]'::jsonb,   -- espelha messages do app.jsx
  history jsonb not null default '[]'::jsonb,    -- espelha history.current (log pro LLM)
  options jsonb not null default '[]'::jsonb,
  mode text not null default 'dialog',
  party_at text not null default 'tavern',
  turn_count integer not null default 0,         -- rodadas jogadas nesta campanha
  demo_limit integer not null default 40,        -- teto da versão demo
  status text not null default 'active',         -- active | demo_limit_reached | finished
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaign_sessions_user_idx on public.campaign_sessions(user_id);
create index if not exists campaign_sessions_status_idx on public.campaign_sessions(user_id, status);

-- RLS: cada jogador só enxerga e edita os próprios dados.
alter table public.characters enable row level security;
alter table public.campaign_sessions enable row level security;

drop policy if exists "own characters" on public.characters;
create policy "own characters" on public.characters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own campaign sessions" on public.campaign_sessions;
create policy "own campaign sessions" on public.campaign_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Mantém updated_at correto sem depender do cliente lembrar de setar.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.characters;
create trigger set_updated_at before update on public.characters
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.campaign_sessions;
create trigger set_updated_at before update on public.campaign_sessions
  for each row execute function public.set_updated_at();
