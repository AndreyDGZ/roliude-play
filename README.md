# Rolliúde Play

Rolliúde Play é uma plataforma web para valorização, descoberta e exibição do cinema brasileiro e regional.

## Stack

| Área | Tecnologias |
|---|---|
| Frontend | React, Vite, TypeScript |
| Backend | Node, Express, TypeScript, Prisma |
| Banco | PostgreSQL |
| Ambiente | Docker Compose |

## Requisitos

- Node `>=20`
- Yarn `1.22.22`
- Docker e Docker Compose para ambiente completo

## Rodar com Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3000/api/health`

## Rodar manualmente

Backend:

```bash
cd Rolliude-backend
cp .env.example .env
yarn install --frozen-lockfile
yarn prisma:validate
yarn dev
```

Frontend:

```bash
cd Rolliude-front
yarn install --frozen-lockfile
yarn dev
```

## Dados iniciais e documentação da API

No backend, depois de aplicar as migrations:

```bash
yarn prisma migrate deploy
yarn db:seed
```

O seed carrega gêneros, estados com região e alguns municípios. Defina `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` no `.env` para criar um administrador.

O contrato da API é gerado dos schemas do backend e fica em `http://localhost:3000/api/docs/openapi.json`. O guia de uso está em `Rolliude-project/docs/api/catalog.md`.

## Checks

Execute nas pastas `Rolliude-front/` e `Rolliude-backend/`:

```bash
yarn format:check
yarn typecheck
yarn build
```

No backend, execute também:

```bash
yarn prisma:validate
```

## Fontes canônicas

- Regras de autoridade: `Rolliude-project/project-standards/01-authority-map.md`
- Padrões do projeto: `Rolliude-project/project-standards/`
- Decisões arquiteturais: `Rolliude-project/docs/architecture/adr/`
- Contribuição: `Rolliude-project/CONTRIBUTING.md`
- Instruções para agentes: `AGENTS.md`
