-- ==============================================================================
-- BANCO DE DADOS RELACIONAL (SQL) - JIFS 2026 (CAMPUS SAPUCAIA)
-- Script 100% Limpo e Recriável no Supabase (PostgreSQL)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. LIMPEZA INICIAL (Garante a remoção de tabelas antigas para evitar erros de tipo)
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS vw_conflitos_escala CASCADE;
DROP VIEW IF EXISTS vw_agenda_sapucaia CASCADE;
DROP TABLE IF EXISTS escala_chefia_dia CASCADE;
DROP TABLE IF EXISTS atribuicoes_professores CASCADE;
DROP TABLE IF EXISTS jogos CASCADE;
DROP TABLE IF EXISTS modalidades CASCADE;
DROP TABLE IF EXISTS locais CASCADE;
DROP TABLE IF EXISTS professores CASCADE;

-- ------------------------------------------------------------------------------
-- 1. TABELA: PROFESSORES (Corpo Docente / Responsáveis)
-- ------------------------------------------------------------------------------
CREATE TABLE professores (
    id VARCHAR(50) PRIMARY KEY, -- Aceita IDs numéricos e alfanuméricos (ex: 'p1', 'p_1692384920')
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    modalidade_preferencial VARCHAR(50) DEFAULT 'Geral',
    cor_hex VARCHAR(7) NOT NULL DEFAULT '#10b981',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. TABELA: LOCAIS (Quadras, Ginásios e Campos de Jogos)
-- ------------------------------------------------------------------------------
CREATE TABLE locais (
    id VARCHAR(20) PRIMARY KEY, -- Ex: 'Q1', 'Q2', 'Q3', 'Cavasotto', 'Unisinos', 'Q1_Praia'
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL   -- Ex: 'Quadra Poliesportiva', 'Campo de Futebol'
);

-- ------------------------------------------------------------------------------
-- 3. TABELA: MODALIDADES (Esportes e Categorias)
-- ------------------------------------------------------------------------------
CREATE TABLE modalidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    categoria VARCHAR(20) NOT NULL -- 'Masculino' ou 'Feminino'
);

-- ------------------------------------------------------------------------------
-- 4. TABELA: JOGOS (Tabela Oficial de Horários e Partidas)
-- ------------------------------------------------------------------------------
CREATE TABLE jogos (
    id VARCHAR(30) PRIMARY KEY, -- Ex: 'BF_1', 'BM_3', 'FM_4'
    modalidade_nome VARCHAR(80) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    data_jogo DATE NOT NULL,              -- Ex: '2026-08-25'
    horario TIME NOT NULL,                -- Ex: '09:30:00'
    chave VARCHAR(30) NOT NULL,           -- Ex: 'Única', 'Chave A', 'Semifinal'
    quadra_id VARCHAR(20) NOT NULL,
    equipe1 VARCHAR(100) NOT NULL,
    equipe2 VARCHAR(100) NOT NULL,
    is_sapucaia BOOLEAN NOT NULL DEFAULT FALSE,
    status_partida VARCHAR(30) NOT NULL DEFAULT 'Confirmado', -- 'Confirmado', 'Condicional'
    nota_condicional TEXT,
    CONSTRAINT fk_jogos_locais FOREIGN KEY (quadra_id) REFERENCES locais(id) ON UPDATE CASCADE
);

-- Indexação para busca rápida por data e horário
CREATE INDEX idx_jogos_data_horario ON jogos(data_jogo, horario);
CREATE INDEX idx_jogos_sapucaia ON jogos(is_sapucaia);

-- ------------------------------------------------------------------------------
-- 5. TABELA: ATRIBUICOES_PROFESSORES (Escala de Docente por Jogo)
-- ------------------------------------------------------------------------------
CREATE TABLE atribuicoes_professores (
    id SERIAL PRIMARY KEY,
    jogo_id VARCHAR(30) NOT NULL UNIQUE, -- Um jogo tem no máximo 1 professor principal escalado
    professor_id VARCHAR(50) NOT NULL,
    atribuido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atribuicao_jogo FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    CONSTRAINT fk_atribuicao_professor FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 6. TABELA: ESCALA_CHEFIA_DIA (Chefe da Delegação por Dia)
-- ------------------------------------------------------------------------------
CREATE TABLE escala_chefia_dia (
    data_escala DATE PRIMARY KEY,
    professor_id VARCHAR(50),
    observacoes TEXT,
    CONSTRAINT fk_chefia_professor FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL
);

-- ==============================================================================
-- VIEWS (VISÕES CONSULTIVAS PARA DETECÇÃO DE CONFLITOS E RELATÓRIOS)
-- ==============================================================================

-- VIEW 1: AGENDA COMPLETA DO CAMPUS SAPUCAIA COM PROFESSOR RESPONSÁVEL
CREATE VIEW vw_agenda_sapucaia AS
SELECT 
    j.id AS jogo_id,
    j.data_jogo,
    j.horario,
    j.modalidade_nome,
    j.categoria,
    j.quadra_id,
    l.nome AS quadra_nome,
    j.equipe1,
    j.equipe2,
    j.status_partida,
    p.id AS professor_id,
    COALESCE(p.nome, 'SEM PROFESSOR ESCALADO') AS professor_nome,
    COALESCE(p.cor_hex, '#94a3b8') AS professor_cor
FROM jogos j
JOIN locais l ON j.quadra_id = l.id
LEFT JOIN atribuicoes_professores ap ON j.id = ap.jogo_id
LEFT JOIN professores p ON ap.professor_id = p.id
WHERE j.is_sapucaia = TRUE OR j.equipe1 ILIKE '%Sapucaia%' OR j.equipe2 ILIKE '%Sapucaia%'
ORDER BY j.data_jogo, j.horario, j.quadra_id;

-- VIEW 2: DETECTOR DE CONFLITOS E PENDÊNCIAS DE ESCALA
CREATE VIEW vw_conflitos_escala AS
WITH jogos_simultaneos AS (
    SELECT 
        j.data_jogo,
        j.horario,
        COUNT(j.id) AS total_jogos,
        COUNT(ap.professor_id) AS total_professores_escalados,
        COUNT(DISTINCT ap.professor_id) AS professores_unicos
    FROM jogos j
    LEFT JOIN atribuicoes_professores ap ON j.id = ap.jogo_id
    WHERE j.is_sapucaia = TRUE OR j.equipe1 ILIKE '%Sapucaia%' OR j.equipe2 ILIKE '%Sapucaia%'
    GROUP BY j.data_jogo, j.horario
    HAVING COUNT(j.id) > 1
)
SELECT 
    js.data_jogo,
    js.horario,
    js.total_jogos,
    CASE 
        WHEN js.total_professores_escalados < js.total_jogos THEN 'PENDÊNCIA: Jogo sem professor escalado'
        WHEN js.professores_unicos < js.total_professores_escalados THEN 'CONFLITO: Mesmo professor duplicado em quadras diferentes'
        ELSE 'ESCALA OK: Professores diferentes escalados'
    END AS status_conflito
FROM jogos_simultaneos js
WHERE js.total_professores_escalados < js.total_jogos 
   OR js.professores_unicos < js.total_professores_escalados;

-- ==============================================================================
-- POVOAMENTO INICIAL DE DADOS (SEED DATA)
-- ==============================================================================

-- Inserir Locais
INSERT INTO locais (id, nome, tipo) VALUES
('Q1', 'Quadra Q1', 'Quadra Poliesportiva'),
('Q2', 'Quadra Q2', 'Quadra Poliesportiva'),
('Q3', 'Quadra Q3', 'Quadra Poliesportiva'),
('Cavasotto', 'Ginásio Cavasotto', 'Ginásio Externo'),
('Unisinos', 'Campo Unisinos', 'Campo de Futebol'),
('Q1_Praia', 'Quadra 1 (Praia)', 'Quadra de Areia');

-- Inserir Professores Padrão
INSERT INTO professores (id, nome, email, modalidade_preferencial, cor_hex) VALUES
('p1', 'Prof. Carlos Eduardo', 'carlos.eduardo@sapucaia.ifsul.edu.br', 'Futsal', '#10b981'),
('p2', 'Profª Ana Paula', 'ana.paula@sapucaia.ifsul.edu.br', 'Voleibol', '#0284c7'),
('p3', 'Prof. Rodrigo Silva', 'rodrigo.silva@sapucaia.ifsul.edu.br', 'Basquete', '#8b5cf6'),
('p4', 'Profª Mariana Ramos', 'mariana.ramos@sapucaia.ifsul.edu.br', 'Handebol', '#ec4899'),
('p5', 'Prof. Fernando Souza', 'fernando.souza@sapucaia.ifsul.edu.br', 'Futebol', '#f59e0b');

-- Inserir Amostra de Jogos do Campus Sapucaia
INSERT INTO jogos (id, modalidade_nome, categoria, data_jogo, horario, chave, quadra_id, equipe1, equipe2, is_sapucaia, status_partida) VALUES
('BF_1', 'Basquete Feminino', 'Feminino', '2026-08-25', '17:30:00', 'Única', 'Q2', 'Novo Hamburgo', 'Sapucaia', TRUE, 'Confirmado'),
('BM_3', 'Basquete Masculino', 'Masculino', '2026-08-25', '14:30:00', 'Única', 'Q2', 'Passo Fundo', 'Sapucaia', TRUE, 'Confirmado'),
('BM_5', 'Basquete Masculino', 'Masculino', '2026-08-25', '16:30:00', 'Única', 'Q2', 'Sapucaia', 'Venâncio Aires', TRUE, 'Confirmado'),
('FF_3', 'Futsal Feminino', 'Feminino', '2026-08-25', '16:30:00', 'Única', 'Q1', 'Passo Fundo', 'Sapucaia', TRUE, 'Confirmado'),
('FUT_1', 'Futebol de Campo Masculino', 'Masculino', '2026-08-25', '09:00:00', 'Única', 'Unisinos', 'Sapucaia', 'Lajeado', TRUE, 'Confirmado'),
('VF_1', 'Voleibol Feminino', 'Feminino', '2026-08-25', '09:30:00', 'Chave B', 'Q2', 'Sapucaia', 'Lajeado', TRUE, 'Confirmado'),
('VM_1', 'Voleibol Masculino', 'Masculino', '2026-08-25', '09:30:00', 'Chave A', 'Q3', 'Sapucaia', 'Venâncio Aires', TRUE, 'Confirmado');

-- Atribuir Professores de Exemplo
INSERT INTO atribuicoes_professores (jogo_id, professor_id) VALUES
('VF_1', 'p2'),
('VM_1', 'p1');
