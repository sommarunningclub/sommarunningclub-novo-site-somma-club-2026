-- Configuração de estado das inscrições do Esplanada Run (abertas/fechadas)
create table if not exists public.config_esplanada (
  id smallint primary key default 1,
  inscricoes_abertas boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint config_singleton check (id = 1)
);

-- Linha única
insert into public.config_esplanada (id, inscricoes_abertas)
values (1, true)
on conflict (id) do nothing;
