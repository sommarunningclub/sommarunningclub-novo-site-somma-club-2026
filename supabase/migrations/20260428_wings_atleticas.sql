-- ============================================================
-- WINGS DAS ATLÉTICAS 2026 — Atletic Day Wings for Life 2
-- Migration: cria estrutura de instituições, atléticas e
-- inscrições do evento; reaproveita a tabela `eventos` existente.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Seed do evento na tabela `eventos` (já existente)
-- ------------------------------------------------------------
-- Wings das Atléticas não usa pelotões (override do default ARRAY['4km','6km','8km']).
INSERT INTO eventos (id, titulo, data_evento, horario_inicio, local, local_url, tipo, checkin_status, descricao, pelotoes)
SELECT
  gen_random_uuid(),
  'Wings das Atléticas 2026 — Atletic Day Wings for Life 2',
  '2026-05-24',
  '06:00',
  'Centro Olímpico — CO UnB, Brasília, DF',
  'https://maps.app.goo.gl/8hLYd9ULSM76Ffeh8',
  'corrida',
  'aberto',
  'Atletic Day Wings for Life 2 — encontro das atléticas da UnB e CEUB no Centro Olímpico.',
  ARRAY[]::text[]
WHERE NOT EXISTS (
  SELECT 1 FROM eventos WHERE titulo = 'Wings das Atléticas 2026 — Atletic Day Wings for Life 2'
);

-- ------------------------------------------------------------
-- 2. Instituições
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO institutions (name) VALUES ('UNB'), ('CEUB')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------
-- 3. Atléticas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS atleticas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (name, institution_id)
);

CREATE INDEX IF NOT EXISTS idx_atleticas_institution ON atleticas(institution_id);

-- Seed UNB (25)
INSERT INTO atleticas (name, institution_id)
SELECT a.name, i.id FROM (VALUES
  ('Tóxica'),('Mutante'),('Explosiva'),('Dialética'),('Olímpia'),
  ('Halterada'),('Alucinada'),('Energética'),('Enfurecida'),('Frenética'),
  ('Hermética'),('Maquinada'),('Milionária'),('Mítica'),('Desnaturada'),
  ('Presidência'),('Atentada'),('Tijolada'),('Polarizada'),('Visionária'),
  ('Épica'),('Psicodélica'),('Insana'),('Moedora'),('Indomável')
) AS a(name)
CROSS JOIN institutions i WHERE i.name = 'UNB'
ON CONFLICT (name, institution_id) DO NOTHING;

-- Seed CEUB (5)
INSERT INTO atleticas (name, institution_id)
SELECT a.name, i.id FROM (VALUES
  ('Reabilitada'),('Carnívora'),('Selvagem'),('Lendária'),('Sustenta')
) AS a(name)
CROSS JOIN institutions i WHERE i.name = 'CEUB'
ON CONFLICT (name, institution_id) DO NOTHING;

-- ------------------------------------------------------------
-- 4. Inscrições do evento Wings das Atléticas
--    Tabela dedicada para preservar a `event_registrations`
--    já em uso pela Catcher Run.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wings_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE NOT NULL,

  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  cpf TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('M', 'F', 'NB', 'PNR')),

  institution_id UUID REFERENCES institutions(id) NOT NULL,
  atletica_id UUID REFERENCES atleticas(id) NOT NULL,

  checkin_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (checkin_status IN ('pending', 'checked_in', 'no_show')),
  checkin_at TIMESTAMPTZ,
  checkin_by TEXT,

  registration_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  UNIQUE (evento_id, cpf)
);

CREATE INDEX IF NOT EXISTS idx_wings_reg_evento ON wings_registrations(evento_id);
CREATE INDEX IF NOT EXISTS idx_wings_reg_atletica ON wings_registrations(atletica_id);
CREATE INDEX IF NOT EXISTS idx_wings_reg_checkin ON wings_registrations(checkin_status);
CREATE INDEX IF NOT EXISTS idx_wings_reg_cpf ON wings_registrations(cpf);

-- ------------------------------------------------------------
-- 5. RLS — leitura pública para form, escrita via service_role
-- ------------------------------------------------------------
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atleticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE wings_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_institutions" ON institutions;
CREATE POLICY "public_read_institutions" ON institutions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_atleticas" ON atleticas;
CREATE POLICY "public_read_atleticas" ON atleticas
  FOR SELECT USING (is_active = true);

-- Inserts/updates só via service_role (admin API). Sem policy = bloqueado para anon.

-- ------------------------------------------------------------
-- 6. Trigger updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION wings_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wings_registrations_updated_at ON wings_registrations;
CREATE TRIGGER wings_registrations_updated_at
  BEFORE UPDATE ON wings_registrations
  FOR EACH ROW EXECUTE FUNCTION wings_set_updated_at();

-- ------------------------------------------------------------
-- 7. Realtime — publicar updates de wings_registrations
-- ------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE wings_registrations;
