-- Config singleton da competição: flags que o staff controla em runtime.
-- final_liberada: quando true, o ranking público mostra resultados da final;
--                 senão, ranking público fica congelado na classificatória
--                 (admin sempre vê preview).

CREATE TABLE IF NOT EXISTS public.wings_comp_config (
  id text PRIMARY KEY DEFAULT 'singleton' CHECK (id = 'singleton'),
  final_liberada boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.wings_comp_config (id, final_liberada)
VALUES ('singleton', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: leitura pública (ranking precisa ler), escrita só via service role
ALTER TABLE public.wings_comp_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "config_read_anon" ON public.wings_comp_config;
CREATE POLICY "config_read_anon"
  ON public.wings_comp_config
  FOR SELECT
  USING (true);

-- Realtime para o ranking público reagir em tempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.wings_comp_config;
