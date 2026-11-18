# Backend, banco e API

Pasta: `Rolliude-backend/`. Stack em `tooling.md`.

## Estrutura

```
src/app/app.ts        monta o Express, rotas e errorHandler
src/app/server.ts     sobe o processo
src/config/env.ts     variáveis validadas com Zod antes de subir (PORT 3333, CORS_ORIGIN, FRONTEND_URL)
src/config/prisma.ts  PrismaClient único
src/modules/<dominio>/  controller, routes, schema, service e mapper
src/shared/errors/    AppError, errorHandler, schema da resposta de erro
src/shared/search/    normalização de texto da busca
src/shared/events/    EventBus (Kafka ou memória), schema do evento de lançamento
src/seed/             dados locais (yarn db:seed)
```

Módulos atuais: `movies`, `reviews`, `professionals`, `behind-the-scenes`, `notifications`, `docs`.

## Regras

- Código de negócio só em `src/modules/<dominio>/`. `shared/` não importa módulo de negócio. Não criar módulo vazio de roadmap nem pastas planas `controllers/`, `services/` na raiz de `src/`.
- Toda rota valida a entrada com um schema Zod do próprio módulo.
- O `mapper` converte a entidade Prisma no formato da resposta. Nunca devolver entidade Prisma crua.
- Erro sempre passa pelo `errorHandler`, formato `{ message, errors? }`; erro de validação é 400 com `errors: [{ field, message }]`. Erro de regra usa `new AppError(mensagem, status)`.
- Mensagens de erro em português.

## Contrato HTTP

O contrato oficial é o OpenAPI gerado a partir dos schemas Zod em `src/modules/docs/openapi.ts`, servido em `GET /api/docs/openapi.json`. Não escrever OpenAPI à mão nem tipo de front que divirja dele.

| Método | Caminho | Uso |
|---|---|---|
| GET | `/api/movies` | catálogo paginado (`busca`, `ordenar` = `recentes`/`titulo`/`ano`, `pagina` padrão 1, `limite` padrão 12 máximo 48) |
| GET | `/api/movies/:id` | ficha do filme |
| POST, PATCH, DELETE | `/api/movies`, `/api/movies/:id` | administração do catálogo |
| POST | `/api/movies/:id/reviews` | nova avaliação (nota 1 a 5) |
| GET, POST, PATCH, DELETE | `/api/professionals` | profissionais |
| GET, POST, PATCH, DELETE | `/api/behind-the-scenes` | bastidores |
| GET | `/api/notifications` | notificações dos últimos 30 dias por `dispositivoId`, com `lida` e `meta.naoLidas` |
| POST | `/api/notifications/:id/read`, `/api/notifications/read-all` | marcar como lida (body `dispositivoId`) |
| GET | `/api/notifications/stream` | SSE, evento `release`; aceita `Last-Event-ID` |

Lista paginada responde `{ data, meta: { pagina, limite, total, totalPaginas } }`; item único responde `{ data }`.

## Banco

- Fonte única: `Rolliude-backend/prisma/schema.prisma` + `prisma/migrations/`. SQL solto fora disso não vale.
- Modelos atuais: `Filme`, `ElencoItem`, `ItemBastidores`, `Avaliacao`, `Profissional`, `EventoOutbox`, `Notificacao`, `NotificacaoLeitura`, enum `ClassificacaoIndicativa`.

## Eventos (Kafka)

- Cadastro de filme grava, na mesma transação, o filme (`lancadoEm`) e uma linha em `eventos_outbox` (padrão outbox). Nunca publicar no Kafka direto do service.
- `OutboxRelay` publica os pendentes a cada `OUTBOX_INTERVAL_MS` (`FOR UPDATE SKIP LOCKED`).
- Tópico `catalogo.lancamentos` (3 partições, chave = id do filme) e `catalogo.lancamentos.dlq`. Evento `catalogo.filme.lancado` v1 validado por `releaseEventSchema` na publicação e no consumo.
- Grupos: `notificacoes-persistencia` (grava `Notificacao`, idempotente por `eventId`, que também é o `id`) e `notificacoes-sse-<hostname>` (repassa ao `SseHub`). 3 falhas: DLQ no Kafka, aviso no log em memória.
- `KAFKA_ENABLED=false` (padrão) usa `InMemoryEventBus`, mesmo fluxo sem broker.
- Tabelas e colunas em snake_case via `@map`/`@@map`; campos no Prisma em camelCase português.
- `filmes.titulo_busca` é derivada (título e título original em minúsculas e sem acento), indexada com GIN `gin_trgm_ops`. Só o service de filmes escreve nela; nunca vem da requisição.
- `notaMedia` e `avaliacoesCount` são recalculados pelo service de avaliações.
- Migration nova: `prisma migrate dev` contra banco descartável e `yarn prisma:validate` antes do PR.

## Mídia e autenticação

- Vídeo e trailer são só URLs. Upload ou streaming de arquivo grande pelo Node é proibido sem decisão nova.
- Ainda não existe login nem usuário. A decisão para quando existir está em `decisions.md` (e-mail e senha, bcrypt, JWT, token de recuperação de uso único, segredos só em variável de ambiente). Até lá, as rotas de escrita estão abertas: isso é pendência, não padrão.
