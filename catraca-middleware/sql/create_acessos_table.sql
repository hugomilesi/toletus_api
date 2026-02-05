-- =============================================
-- Schema para tabela de Acessos - Catraca Middleware
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela principal de acessos
CREATE TABLE IF NOT EXISTS acessos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pessoa_id INTEGER,
    pessoa_nome TEXT,
    token TEXT,
    tipo TEXT NOT NULL DEFAULT 'entrada' CHECK (tipo IN ('entrada', 'saida')),
    liberado BOOLEAN NOT NULL DEFAULT false,
    motivo_bloqueio TEXT,
    curso TEXT,
    professor TEXT,
    horario_aula TIMESTAMPTZ,
    catraca_ip TEXT,
    catraca_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_acessos_pessoa_id ON acessos(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_acessos_created_at ON acessos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_acessos_tipo ON acessos(tipo);
CREATE INDEX IF NOT EXISTS idx_acessos_liberado ON acessos(liberado);

-- Comentários para documentação
COMMENT ON TABLE acessos IS 'Histórico de entradas e saídas registradas pela catraca';
COMMENT ON COLUMN acessos.pessoa_id IS 'ID da pessoa no Emusys';
COMMENT ON COLUMN acessos.pessoa_nome IS 'Nome da pessoa no momento do acesso';
COMMENT ON COLUMN acessos.token IS 'Token utilizado para identificação';
COMMENT ON COLUMN acessos.tipo IS 'Tipo de acesso: entrada ou saida';
COMMENT ON COLUMN acessos.liberado IS 'Se o acesso foi liberado (true) ou bloqueado (false)';
COMMENT ON COLUMN acessos.motivo_bloqueio IS 'Código do motivo de bloqueio (ex: PESSOA_INADIMPLENTE)';
COMMENT ON COLUMN acessos.curso IS 'Nome do curso da aula agendada';
COMMENT ON COLUMN acessos.professor IS 'Nome do professor da aula';
COMMENT ON COLUMN acessos.horario_aula IS 'Horário da aula agendada';
COMMENT ON COLUMN acessos.catraca_ip IS 'IP da catraca que registrou o acesso';
COMMENT ON COLUMN acessos.catraca_id IS 'ID da catraca que registrou o acesso';

-- Habilitar RLS (Row Level Security) - opcional, descomente se necessário
-- ALTER TABLE acessos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção anônima (via anon key)
-- CREATE POLICY "Allow anonymous insert" ON acessos FOR INSERT WITH CHECK (true);

-- Política para permitir leitura autenticada
-- CREATE POLICY "Allow authenticated read" ON acessos FOR SELECT USING (auth.role() = 'authenticated');
