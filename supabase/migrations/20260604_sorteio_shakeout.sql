-- Sorteio dedicado da ativação Shake Out (sorteia de leads_shakeout_centauro).

create table if not exists public.sorteios_shakeout (
  id                 uuid primary key default gen_random_uuid(),
  titulo             text not null,
  filtros_aplicados  jsonb not null default '{}',
  total_elegiveis    int not null default 0,
  criado_por         text,
  audit_hash         text,
  created_at         timestamptz not null default now()
);

create table if not exists public.ganhadores_shakeout (
  id              uuid primary key default gen_random_uuid(),
  sorteio_id      uuid not null references public.sorteios_shakeout(id) on delete cascade,
  lead_id         uuid,
  posicao         int not null,
  numero_sorteado int not null,
  status          text not null default 'pendente',   -- pendente | confirmado | ausente
  confirmado_em   timestamptz,
  substituido_por uuid,
  -- snapshot do participante (evita joins e preserva histórico)
  nome_completo   text,
  email           text,
  telefone        text,
  cpf             text,
  sexo            text,
  uf              text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_ganh_shake_sorteio on public.ganhadores_shakeout (sorteio_id);

alter table public.sorteios_shakeout enable row level security;
alter table public.ganhadores_shakeout enable row level security;
