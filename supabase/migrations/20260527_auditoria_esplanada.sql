-- Governança / antifraude do Esplanada Run
-- Colunas de auditoria na tabela de inscrições
alter table public.inscricoes_esplanada_run
  add column if not exists status text not null default 'ativo',
  add column if not exists observacao_interna text,
  add column if not exists risk_score integer not null default 0,
  add column if not exists fraud_reason text,
  add column if not exists duplicate_group_id uuid,
  add column if not exists revisado boolean not null default false,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by text;

-- Garante que registros antigos tenham status definido
update public.inscricoes_esplanada_run set status = 'ativo' where status is null;

-- Extensão de similaridade de texto (nomes)
create extension if not exists pg_trgm;

-- Indexes de performance
create index if not exists idx_insc_esp_cpf on public.inscricoes_esplanada_run (cpf);
create index if not exists idx_insc_esp_telefone on public.inscricoes_esplanada_run (telefone);
create index if not exists idx_insc_esp_email on public.inscricoes_esplanada_run (email);
create index if not exists idx_insc_esp_status on public.inscricoes_esplanada_run (status);
create index if not exists idx_insc_esp_risk on public.inscricoes_esplanada_run (risk_score);
create index if not exists idx_insc_esp_group on public.inscricoes_esplanada_run (duplicate_group_id);
create index if not exists idx_insc_esp_nome_trgm on public.inscricoes_esplanada_run using gin (nome gin_trgm_ops);
