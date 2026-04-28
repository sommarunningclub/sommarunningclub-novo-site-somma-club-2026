-- ============================================================
-- WINGS DAS ATLÉTICAS — ocultar evento da página pública /check-in
--
-- O evento Wings tem fluxo de inscrição próprio em
-- /wings-das-atleticas-2026. Este flag impede que ele apareça
-- na lista geral de check-in mas mantém visível no admin Somma.
-- ============================================================

ALTER TABLE eventos
  ADD COLUMN IF NOT EXISTS oculto_no_checkin_publico BOOLEAN DEFAULT false NOT NULL;

CREATE INDEX IF NOT EXISTS idx_eventos_oculto_publico
  ON eventos(oculto_no_checkin_publico);

-- Marca Wings das Atléticas 2026 como oculto
UPDATE eventos
   SET oculto_no_checkin_publico = true
 WHERE titulo = 'Wings das Atléticas 2026 — Atletic Day Wings for Life 2';
