-- ============================================================
-- WINGS DAS ATLÉTICAS — sincronização de exclusão
--
-- Quando uma linha de `checkins` for deletada (via admin Somma
-- ou qualquer cliente), apaga automaticamente o registro
-- correspondente em `wings_registrations` (match por evento_id + cpf).
--
-- Mantém ambas as tabelas sempre em sincronia.
-- ============================================================

CREATE OR REPLACE FUNCTION wings_sync_delete_from_checkins()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.evento_id IS NOT NULL AND OLD.cpf IS NOT NULL THEN
    DELETE FROM wings_registrations
    WHERE evento_id = OLD.evento_id
      AND cpf = OLD.cpf;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_wings_sync_delete_from_checkins ON checkins;
CREATE TRIGGER trg_wings_sync_delete_from_checkins
  AFTER DELETE ON checkins
  FOR EACH ROW EXECUTE FUNCTION wings_sync_delete_from_checkins();

-- Também o caminho inverso: se alguém deletar direto de
-- wings_registrations (admin do site Wings, por ex.), apaga
-- a linha espelho em `checkins` se existir.
CREATE OR REPLACE FUNCTION wings_sync_delete_from_wings()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.evento_id IS NOT NULL AND OLD.cpf IS NOT NULL THEN
    DELETE FROM checkins
    WHERE evento_id = OLD.evento_id
      AND cpf = OLD.cpf;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_wings_sync_delete_from_wings ON wings_registrations;
CREATE TRIGGER trg_wings_sync_delete_from_wings
  AFTER DELETE ON wings_registrations
  FOR EACH ROW EXECUTE FUNCTION wings_sync_delete_from_wings();
