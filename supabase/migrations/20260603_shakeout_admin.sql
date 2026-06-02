-- Admin do Shake Out: campo sexo + controle de abertura das inscrições.

-- 1) Sexo no check-in
alter table public.leads_shakeout_centauro
  add column if not exists sexo text;

-- 2) Config de inscrições (linha única, id = 1)
create table if not exists public.config_shakeout (
  id                 int primary key default 1,
  inscricoes_abertas boolean not null default true,
  updated_at         timestamptz not null default now(),
  constraint config_shakeout_singleton check (id = 1)
);

insert into public.config_shakeout (id, inscricoes_abertas)
  values (1, true)
  on conflict (id) do nothing;

alter table public.config_shakeout enable row level security;
