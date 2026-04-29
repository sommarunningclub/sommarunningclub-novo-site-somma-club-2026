-- Módulo de cronometragem do Revezamento 4×100m misto — Wings das Atléticas 2026
-- Tabelas separadas das de inscrição (wings_registrations / atleticas) por domínio distinto:
-- aqui a "atlética" é a equipe competidora, não a entidade onde o aluno se inscreveu.

-- =====================================================================
-- ATLÉTICAS COMPETIDORAS
-- =====================================================================
create table if not exists public.wings_comp_atleticas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  sigla text,
  cor text default '#E30D3F', -- hex pra identidade visual no ranking
  created_at timestamptz default now()
);

-- =====================================================================
-- ATLETAS DE CADA EQUIPE
-- =====================================================================
create table if not exists public.wings_comp_atletas (
  id uuid primary key default gen_random_uuid(),
  atletica_id uuid not null references public.wings_comp_atleticas(id) on delete cascade,
  nome text not null,
  sexo text not null check (sexo in ('M','F')),
  modalidade int not null check (modalidade between 1 and 4),
  -- 1 = Um pé só
  -- 2 = Dois pés juntos saltando
  -- 3 = Corrida de costas
  -- 4 = Engatinhando em 4 apoios
  created_at timestamptz default now()
);

create index if not exists idx_wings_comp_atletas_atletica on public.wings_comp_atletas(atletica_id);

-- =====================================================================
-- RUNS / BATERIAS
-- =====================================================================
create table if not exists public.wings_comp_runs (
  id uuid primary key default gen_random_uuid(),
  atletica_id uuid not null references public.wings_comp_atleticas(id) on delete cascade,
  fase text not null default 'classificatoria' check (fase in ('classificatoria','final')),
  tempo_bruto_ms int not null,
  penalidade_1_ms int not null default 0,
  penalidade_2_ms int not null default 0,
  penalidade_3_ms int not null default 0,
  penalidade_4_ms int not null default 0,
  tempo_final_ms int generated always as
    (tempo_bruto_ms + penalidade_1_ms + penalidade_2_ms + penalidade_3_ms + penalidade_4_ms) stored,
  observacoes text,
  created_at timestamptz default now()
);

create index if not exists idx_wings_comp_runs_atletica on public.wings_comp_runs(atletica_id);
create index if not exists idx_wings_comp_runs_fase_tempo on public.wings_comp_runs(fase, tempo_final_ms);

-- =====================================================================
-- RLS — leitura pública (ranking ao vivo), escrita apenas service_role
-- =====================================================================
alter table public.wings_comp_atleticas enable row level security;
alter table public.wings_comp_atletas enable row level security;
alter table public.wings_comp_runs enable row level security;

drop policy if exists "wings_comp_atleticas_read_public" on public.wings_comp_atleticas;
create policy "wings_comp_atleticas_read_public"
  on public.wings_comp_atleticas for select using (true);

drop policy if exists "wings_comp_atletas_read_public" on public.wings_comp_atletas;
create policy "wings_comp_atletas_read_public"
  on public.wings_comp_atletas for select using (true);

drop policy if exists "wings_comp_runs_read_public" on public.wings_comp_runs;
create policy "wings_comp_runs_read_public"
  on public.wings_comp_runs for select using (true);

-- =====================================================================
-- REALTIME
-- =====================================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'wings_comp_runs'
  ) then
    alter publication supabase_realtime add table public.wings_comp_runs;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'wings_comp_atleticas'
  ) then
    alter publication supabase_realtime add table public.wings_comp_atleticas;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'wings_comp_atletas'
  ) then
    alter publication supabase_realtime add table public.wings_comp_atletas;
  end if;
end $$;
