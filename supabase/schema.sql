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

-- ============================================================
-- v0.6 — sistema de classes + recomeço com história variada
-- (Assembleia 05, docs/ASSEMBLEIA-05-CLASSES-E-RECOMECO-VARIADO.md)
-- Seguro rodar de novo: tudo abaixo é idempotente (if not exists /
-- drop if exists antes de criar), igual ao resto deste arquivo.
-- ============================================================

-- Nome de personagem é único GLOBALMENTE (decisão do Tiago, não por
-- jogador nem por cenário) — comparação sem diferenciar maiúsculas
-- pra "Aragorn" e "aragorn" não coexistirem por acidente. Índice único
-- funcional em vez de UNIQUE(name) direto porque o Postgres não aceita
-- UNIQUE sobre uma expressão (lower(name)) na própria definição da coluna.
create unique index if not exists characters_name_unique_ci
  on public.characters (lower(name));

-- Semente narrativa da campanha (Frente B da Assembleia 05) — gancho,
-- entrada do acervo usada como inspiração, quem fala primeiro, clima.
-- Gerada uma vez no início/recomeço da campanha e reenviada ao mestre
-- a cada turno (src/master.js) pra situações ao longo da campanha
-- também variarem, não só a abertura.
alter table public.campaign_sessions
  add column if not exists seed jsonb;

-- ============================================================
-- v0.7 — mapas avançados: névoa por nó, regra de acesso, marcador
-- de missão mínimo (Assembleia 06,
-- docs/ASSEMBLEIA-06-MAPAS-AVANCADOS.md — Finalista 3 vencedor)
-- ============================================================

-- Locais já visitados fisicamente nesta campanha (array de ids, ex.:
-- ["tavern","chapel"]) — controla o que aparece revelado no mapa.
alter table public.campaign_sessions
  add column if not exists discovered jsonb not null default '[]'::jsonb;

-- Pontos de interesse conhecidos por informação (ex.: um NPC contou
-- de um lugar que o jogador nunca visitou) — aparecem no mapa mesmo
-- sem estar em "discovered", sem revelar o terreno ao redor. Lista de
-- objetos { id, title, locationId }.
alter table public.campaign_sessions
  add column if not exists known_markers jsonb not null default '[]'::jsonb;

-- Marcador de missão mínimo — não é sistema de missão completo (sem
-- objetivo/recompensa/conclusão verificável), só o suficiente pra
-- guardar o que um NPC revelou. Lista de objetos
-- { id, titulo, localId, status: 'revelada'|'concluida' }.
alter table public.campaign_sessions
  add column if not exists missions jsonb not null default '[]'::jsonb;
