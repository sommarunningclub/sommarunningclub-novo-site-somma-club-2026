-- Parceiros do Shake Out: acesso de visualização (macro) + adicionar inscritos.
-- Cada parceiro tem um nome e um código de acesso próprio.

create table if not exists public.parceiros_shakeout (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  codigo     text not null unique,
  ativo      boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.parceiros_shakeout enable row level security;
