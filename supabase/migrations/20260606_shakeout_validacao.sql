-- Validação de check-in para o evento Shake Out Centauro (leads_shakeout_centauro)
-- Espelha o fluxo de validação do insider (checkins.validacao_do_checkin / validated_at)

alter table public.leads_shakeout_centauro
  add column if not exists validacao_do_checkin boolean not null default false;

alter table public.leads_shakeout_centauro
  add column if not exists validated_at timestamptz;

-- índice para acelerar a contagem/listagem por status de validação
create index if not exists idx_leads_shakeout_validacao
  on public.leads_shakeout_centauro (validacao_do_checkin);
