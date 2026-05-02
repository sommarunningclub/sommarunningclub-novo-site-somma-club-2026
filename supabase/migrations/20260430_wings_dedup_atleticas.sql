-- Remove atléticas duplicadas (mesmo nome, case-insensitive).
-- Estratégia:
--  1. Em cada grupo, escolhe a "vencedora": quem tem mais atletas; empate? mais runs;
--     empate ainda? a mais antiga (created_at mais antigo).
--  2. Reaponta atletas e runs das duplicadas para a vencedora.
--  3. Apaga as duplicadas.
--  4. Cria índice único para impedir novas duplicatas (case-insensitive).

BEGIN;

-- 1. Identifica vencedoras
WITH ranked AS (
  SELECT
    a.id,
    lower(a.nome) AS nome_norm,
    (SELECT count(*) FROM public.wings_comp_atletas at WHERE at.atletica_id = a.id) AS qtd_atletas,
    (SELECT count(*) FROM public.wings_comp_runs r WHERE r.atletica_id = a.id) AS qtd_runs,
    a.created_at,
    ROW_NUMBER() OVER (
      PARTITION BY lower(a.nome)
      ORDER BY
        (SELECT count(*) FROM public.wings_comp_atletas at WHERE at.atletica_id = a.id) DESC,
        (SELECT count(*) FROM public.wings_comp_runs r WHERE r.atletica_id = a.id) DESC,
        a.created_at ASC
    ) AS rn
  FROM public.wings_comp_atleticas a
),
mapa AS (
  -- Para cada duplicada, qual é a vencedora do mesmo grupo
  SELECT
    perdedora.id AS perdedora_id,
    vencedora.id AS vencedora_id
  FROM ranked perdedora
  JOIN ranked vencedora
    ON vencedora.nome_norm = perdedora.nome_norm
   AND vencedora.rn = 1
  WHERE perdedora.rn > 1
)
-- 2a. Atletas órfãos (que não causariam conflito de modalidade) vão pra vencedora
UPDATE public.wings_comp_atletas at
SET atletica_id = m.vencedora_id
FROM mapa m
WHERE at.atletica_id = m.perdedora_id
  AND NOT EXISTS (
    SELECT 1 FROM public.wings_comp_atletas existente
    WHERE existente.atletica_id = m.vencedora_id
      AND existente.modalidade = at.modalidade
  );

-- 2b. Runs vão pra vencedora (sem conflito — não tem unique nelas após drop anterior)
WITH ranked AS (
  SELECT
    a.id,
    lower(a.nome) AS nome_norm,
    ROW_NUMBER() OVER (
      PARTITION BY lower(a.nome)
      ORDER BY
        (SELECT count(*) FROM public.wings_comp_atletas at WHERE at.atletica_id = a.id) DESC,
        (SELECT count(*) FROM public.wings_comp_runs r WHERE r.atletica_id = a.id) DESC,
        a.created_at ASC
    ) AS rn
  FROM public.wings_comp_atleticas a
),
mapa AS (
  SELECT perdedora.id AS perdedora_id, vencedora.id AS vencedora_id
  FROM ranked perdedora
  JOIN ranked vencedora ON vencedora.nome_norm = perdedora.nome_norm AND vencedora.rn = 1
  WHERE perdedora.rn > 1
)
UPDATE public.wings_comp_runs r
SET atletica_id = m.vencedora_id
FROM mapa m
WHERE r.atletica_id = m.perdedora_id;

-- 3. Apaga duplicadas (atletas em conflito de modalidade vão junto via CASCADE)
WITH ranked AS (
  SELECT
    a.id,
    ROW_NUMBER() OVER (
      PARTITION BY lower(a.nome)
      ORDER BY
        (SELECT count(*) FROM public.wings_comp_atletas at WHERE at.atletica_id = a.id) DESC,
        (SELECT count(*) FROM public.wings_comp_runs r WHERE r.atletica_id = a.id) DESC,
        a.created_at ASC
    ) AS rn
  FROM public.wings_comp_atleticas a
)
DELETE FROM public.wings_comp_atleticas
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 4. Índice único case-insensitive — impede novas duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_wings_comp_atleticas_nome_unique
  ON public.wings_comp_atleticas (lower(nome));

COMMIT;
