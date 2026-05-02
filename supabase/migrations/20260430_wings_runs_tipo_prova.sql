-- Adiciona tipo_prova em wings_comp_runs.
-- Já aplicada em produção via SQL Editor — registrada aqui pra coerência do repo.
-- Cada equipe corre 2 revezamentos (atletismo + dinâmico) e a soma é o tempo final.

ALTER TABLE public.wings_comp_runs
  ADD COLUMN IF NOT EXISTS tipo_prova text NOT NULL DEFAULT 'normal';

ALTER TABLE public.wings_comp_runs
  DROP CONSTRAINT IF EXISTS wings_comp_runs_tipo_prova_chk;
ALTER TABLE public.wings_comp_runs
  ADD CONSTRAINT wings_comp_runs_tipo_prova_chk
  CHECK (tipo_prova IN ('normal','dinamico'));

-- Index pra agregação no ranking (combinado por atlética + fase)
CREATE INDEX IF NOT EXISTS idx_wings_comp_runs_atletica_fase_tipo
  ON public.wings_comp_runs(atletica_id, fase, tipo_prova);
