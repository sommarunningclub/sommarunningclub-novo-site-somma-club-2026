-- Trava qual atlética está classificada para a final.
-- Setado em massa quando o staff fecha a classificatória.

ALTER TABLE public.wings_comp_atleticas
  ADD COLUMN IF NOT EXISTS classificada_final boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_wings_comp_atleticas_classificada_final
  ON public.wings_comp_atleticas(classificada_final)
  WHERE classificada_final = true;
