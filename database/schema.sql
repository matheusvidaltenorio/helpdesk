-- ============================================
-- Help Desk - Schema do Banco de Dados
-- PostgreSQL
-- ============================================
-- Execute: psql -U postgres -d helpdesk -f schema.sql
-- Ou via cliente GUI (pgAdmin, DBeaver, etc.)
-- ============================================

-- Cria o banco (execute separadamente se necessário):
-- CREATE DATABASE helpdesk;

-- Conecte no banco helpdesk e execute o restante:

-- --------------------------------------------
-- Tabela: usuarios
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    senha_hash  VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (role IN ('usuario', 'atendente', 'admin')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Tabela: chamados
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS chamados (
    id          SERIAL PRIMARY KEY,
    usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    titulo      VARCHAR(200) NOT NULL,
    descricao   TEXT NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'resolvido')),
    prioridade  VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Tabela: comentarios
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS comentarios (
    id          SERIAL PRIMARY KEY,
    chamado_id  INT NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    texto       TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Índices (para performance)
-- --------------------------------------------
CREATE INDEX IF NOT EXISTS idx_chamados_usuario_id ON chamados(usuario_id);
CREATE INDEX IF NOT EXISTS idx_chamados_status ON chamados(status);
CREATE INDEX IF NOT EXISTS idx_chamados_created_at ON chamados(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comentarios_chamado_id ON comentarios(chamado_id);

-- --------------------------------------------
-- Trigger: atualizar updated_at automaticamente
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_usuarios_updated_at ON usuarios;
CREATE TRIGGER trigger_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_chamados_updated_at ON chamados;
CREATE TRIGGER trigger_chamados_updated_at
    BEFORE UPDATE ON chamados
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
