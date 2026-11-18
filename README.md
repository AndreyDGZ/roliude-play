# ==== Rolliúde Play ====

Rolliúde Play é uma plataforma web para valorização, descoberta e exibição do cinema brasileiro e regional.

## Stack

| Área | Tecnologias |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
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

Frontend: `http://localhost:3000`

Backend: `http://localhost:3333/api/health`

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
cp .env.example .env
yarn install
yarn dev
```

## Notificações de lançamento (Kafka)

Ao cadastrar um filme, o backend grava um evento na tabela `eventos_outbox` e o publica no tópico `catalogo.lancamentos`. Os navegadores abertos recebem o aviso em tempo real por `GET /api/notifications/stream`.

Com Kafka local (Docker):

```bash
docker compose up -d postgres kafka kafka-ui
```

No `Rolliude-backend/.env`, use `KAFKA_ENABLED=true` e `KAFKA_BROKERS=localhost:9092`. O painel do Kafka fica em `http://localhost:8080`.

Sem Docker para o Kafka, deixe `KAFKA_ENABLED=false`: o mesmo fluxo roda em memória dentro do backend.

## Dados iniciais e documentação da API

No backend, depois de aplicar as migrations:

```bash
yarn prisma migrate deploy
yarn db:seed
```

O seed carrega o catálogo de filmes, profissionais e conteúdos de bastidores. A API é totalmente pública, sem autenticação.

O contrato da API é gerado dos schemas do backend e fica em `http://localhost:3333/api/docs/openapi.json`.

## Checks

Execute nas pastas `Rolliude-front/` e `Rolliude-backend/`:

```bash
yarn lint
yarn build
```

No backend, execute também:

```bash
yarn prisma:validate
```

## Fontes canônicas

- Instruções para agentes: `AGENTS.md`
