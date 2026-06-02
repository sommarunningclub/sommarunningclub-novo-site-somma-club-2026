-- Check-ins/leads da ativação "Shake Out Somma + Centauro RJ" (Casa Dopa Rio)
-- Tabela dedicada exclusiva deste evento. Escrita via service role (RLS habilitado, sem policy pública).

create table if not exists public.leads_shakeout_centauro (
  id                  uuid primary key default gen_random_uuid(),
  nome_completo       text not null,
  email               text not null,
  telefone            text not null,            -- WhatsApp
  cpf                 text,                      -- validado na aplicação (dígitos verificadores)
  uf                  text,
  sexo                text,
  conhecia_somma      boolean not null default false,
  aceite_lgpd         boolean not null default false,
  aceite_comunicacoes boolean not null default false,
  status              text not null default 'confirmado',                 -- 'confirmado' | 'cancelado'
  origem              text not null default 'shakeout-centauro-somma-rj',
  data_de_cadastro    timestamptz not null default now()
);

create index if not exists idx_leads_shake_cpf    on public.leads_shakeout_centauro (cpf);
create index if not exists idx_leads_shake_email  on public.leads_shakeout_centauro (email);
create index if not exists idx_leads_shake_status on public.leads_shakeout_centauro (status);

alter table public.leads_shakeout_centauro enable row level security;
