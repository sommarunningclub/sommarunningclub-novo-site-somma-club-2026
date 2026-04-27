-- Adicionar coluna evento_encerrado à tabela eventos
ALTER TABLE eventos
ADD COLUMN evento_encerrado BOOLEAN DEFAULT FALSE NOT NULL;

-- Criar índice para melhor performance
CREATE INDEX idx_eventos_encerrado ON eventos(evento_encerrado);
