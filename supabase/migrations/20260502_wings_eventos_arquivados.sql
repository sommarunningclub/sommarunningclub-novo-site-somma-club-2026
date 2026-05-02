-- Arquivo histórico de eventos. Cada linha = snapshot completo de um evento finalizado.
-- snapshot guarda { atleticas, atletas, runs, config } em JSON.

CREATE TABLE IF NOT EXISTS public.wings_eventos_arquivados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  data_evento date,
  snapshot jsonb NOT NULL,
  total_atleticas integer NOT NULL DEFAULT 0,
  total_runs integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wings_eventos_arquivados_data
  ON public.wings_eventos_arquivados(data_evento DESC, created_at DESC);

ALTER TABLE public.wings_eventos_arquivados ENABLE ROW LEVEL SECURITY;
-- Sem políticas anônimas — só service role acessa via API admin
