-- Remove a UNIQUE de (atletica_id, fase, tipo_prova) para permitir
-- múltiplas tentativas. O ranking vai usar a melhor (menor) tempo.

DROP INDEX IF EXISTS idx_wings_comp_runs_unique;

-- Mantém o index não-unique pra performance da agregação
CREATE INDEX IF NOT EXISTS idx_wings_comp_runs_atletica_fase_tipo
  ON public.wings_comp_runs(atletica_id, fase, tipo_prova);
