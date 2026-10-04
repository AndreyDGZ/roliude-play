-- Entidade "Usuário" — Seção 11.1 (Banco de Dados) da documentação.
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'usuario'
        CHECK (tipo IN ('usuario', 'curador', 'administrador')),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);  