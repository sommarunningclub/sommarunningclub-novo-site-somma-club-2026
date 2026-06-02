-- Check-ins/leads da ativação "Shake Out Somma + Centauro RJ" (Casa Dopa Rio)
-- Segue o padrão de inscricoes_esplanada_run: escrita via service role, RLS habilitado.

create table if not exists public.leads_shakeout_centauro (
  id                  uuid primary key default gen_random_uuid(),
  nome_completo       text not null,
  email               text not null,
  telefone            text not null,            -- WhatsApp
  cidade              text not null,
  instagram           text,
  conhecia_somma      boolean not null default false,
  aceite_comunicacoes boolean not null default false,
  status              text not null default 'confirmado',                 -- 'confirmado' | 'cancelado'
  origem              text not null default 'shakeout-centauro-somma-rj',
  data_de_cadastro    timestamptz not null default now()
);

create index if not exists idx_leads_shake_email  on public.leads_shakeout_centauro (email);
create index if not exists idx_leads_shake_status on public.leads_shakeout_centauro (status);
create index if not exists idx_leads_shake_data   on public.leads_shakeout_centauro (data_de_cadastro);

-- RLS habilitado: sem policy pública, então só o service role (usado na API route) escreve/lê.
alter table public.leads_shakeout_centauro enable row level security;
