-- Adiciona contagem de barras feitas pelo casal representante.
-- Cada barra = 1s de desconto no tempo combinado da atlética.
-- Aplicado no cálculo do ranking (lado cliente), aqui guardamos só o nº.

ALTER TABLE public.wings_comp_atleticas
  ADD COLUMN IF NOT EXISTS barras integer NOT NULL DEFAULT 0;

ALTER TABLE public.wings_comp_atleticas
  DROP CONSTRAINT IF EXISTS wings_comp_atleticas_barras_chk;
ALTER TABLE public.wings_comp_atleticas
  ADD CONSTRAINT wings_comp_atleticas_barras_chk
  CHECK (barras >= 0 AND barras <= 999);
