-- Adiciona bateria e raia em wings_comp_runs
alter table public.wings_comp_runs
  add column if not exists bateria int,
  add column if not exists raia int;

-- Validação: raia entre 1 e 8 (pista padrão); bateria positiva.
alter table public.wings_comp_runs
  drop constraint if exists wings_comp_runs_bateria_chk;
alter table public.wings_comp_runs
  add constraint wings_comp_runs_bateria_chk check (bateria is null or bateria >= 1);

alter table public.wings_comp_runs
  drop constraint if exists wings_comp_runs_raia_chk;
alter table public.wings_comp_runs
  add constraint wings_comp_runs_raia_chk check (raia is null or (raia >= 1 and raia <= 8));

create index if not exists idx_wings_comp_runs_bateria on public.wings_comp_runs(bateria);
