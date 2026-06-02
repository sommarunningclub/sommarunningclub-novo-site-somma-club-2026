-- Ajustes no check-in do Shake Out: adiciona CPF, UF e aceite LGPD.
-- Remove a obrigatoriedade de cidade/instagram (campos retirados do formulário).

alter table public.leads_shakeout_centauro
  add column if not exists cpf text,
  add column if not exists uf text,
  add column if not exists aceite_lgpd boolean not null default false;

-- cidade/instagram não são mais coletados -> deixam de ser obrigatórios
alter table public.leads_shakeout_centauro alter column cidade drop not null;

create index if not exists idx_leads_shake_cpf on public.leads_shakeout_centauro (cpf);
