# Decisões de arquitetura

Substituem a antiga pasta `Rolliude-project/docs/architecture/adr/`. Decisão nova entra aqui com número seguinte, status, decisão, consequência e data.

| Nº | Assunto | Status | Decisão | Consequência | Data |
|---|---|---|---|---|---|
| 001 | Nome da marca | aceita | "Rolliúde Play" para o público, `rolliude-play` como identificador técnico | textos de tela usam o acento | 2026-09-21 |
| 002 | Runtime e pacotes | aceita | Node >=20 e Yarn 1.22.22 em front e back | sem `package-lock.json`; CI, Docker e docs usam Yarn | 2026-09-21 |
| 003 | Estratégia de estilo | **substituída pela 010** | era CSS Modules + CSS Custom Properties | não usar CSS Modules | 2026-09-21 |
| 004 | Base do banco | **cumprida** | schema Prisma + migrations como base executável | o schema atual é a fonte | 2026-09-21 |
| 005 | Contrato da API | aceita | schemas Zod geram o OpenAPI | não editar contrato ou tipo gerado à mão | 2026-09-21 |
| 006 | Autenticação | aceita, **não implementada** | e-mail e senha, bcrypt, JWT bearer, token de recuperação de uso único com validade | segredos só por variável de ambiente | 2026-09-21 |
| 007 | Mídia e streaming | aceita | MVP guarda URLs; arquivo grande exige decisão própria | sem streaming pelo Node | 2026-09-21 |
| 008 | Reconciliação do catálogo | **substituída pelo schema atual** | previa usuários, gêneros e estados em tabelas | hoje gênero e localização são campos do `Filme`; voltar a tabelas exige decisão nova | 2026-10-14 |
| 009 | Busca do catálogo | aceita | coluna derivada `titulo_busca` + índice GIN `pg_trgm`; até 5 termos, todos precisam casar | só o service de filmes escreve a coluna | 2026-10-14 |
| 010 | Visual e estilo do front | aceita | Tailwind CSS v4 com tokens no `@theme` de `src/index.css`, paleta escura de couro e terracota, Cinzel para títulos, ícones lucide-react | valores definidos em `design-system.md`; hex solto em classe é dívida | 2026-11-15 |
| 011 | Fonte de regras | aceita | a skill `/rolliude-play` é a única fonte de regras e documentação; a pasta `Rolliude-project/` foi removida | toda feature nova segue a skill; mudança de regra atualiza a skill no mesmo PR | 2026-11-15 |
| 012 | Eventos de lançamento | aceita | Kafka (`kafkajs`) com padrão outbox: cadastro grava filme + `eventos_outbox` na mesma transação, relay publica, consumers gravam notificação e repassam por SSE; `KAFKA_ENABLED=false` roda em memória | nada publica no Kafka direto do service; alternativa `@confluentinc/kafka-javascript` se kafkajs parar de receber correção | 2026-11-18 |
| 013 | Leitura de notificação | aceita, provisória | sem login (006), o lido é por dispositivo (`dispositivoId` UUID no `localStorage`) | limpar dados do navegador zera o lido; ao implementar login, trocar por `usuarioId` | 2026-11-18 |
