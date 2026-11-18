---
name: rolliude-play
metadata:
  project: "Rolliúde Play"
  stack: "React 19 + Vite 8 + TypeScript · Tailwind CSS v4 · lucide-react · Node.js + Express 5 + Zod · PostgreSQL via Prisma · Yarn 1.22.22"
description: >-
  Fonte única de regras e documentação do Rolliúde Play: toda feature nova segue esta skill.
  Cobre o Design System oficial (paleta escura de couro e terracota, tokens no @theme do
  Tailwind v4, fonte Cinzel, ícones lucide-react), as ferramentas oficiais de front, back e
  infra, a estrutura do front em Rolliude-front (abas no
  App.tsx, src/components, src/services/api.ts), o backend modular em Rolliude-backend/src/modules,
  Prisma como única fonte do banco, contrato HTTP gerado do Zod, decisões de arquitetura,
  regras obrigatórias de código (sem any, sem comentários, sem variável de uma letra) e o
  fluxo de Git e sprint. Use antes de criar ou alterar componente, cor, classe Tailwind, rota,
  schema Zod, model Prisma, migration, dependência ou documento do projeto. Triggers on:
  "Rolliude Play", "Rolliúde Play", "rolliude", "nova feature", "novo componente", "nova rota",
  "nova tela", "design system", "Tailwind", "@theme", "Cinzel", "lucide", "api.ts", "schema.prisma",
  "migration", "AGENTS.md", "regras do projeto".
---

# Rolliúde Play

Plataforma de cinema brasileiro e regional: catálogo, curadoria por estado e município, ficha técnica, bastidores, profissionais e favoritos.

## Onde mora cada coisa

| Assunto | Fonte oficial |
|---|---|
| Regras, decisões e documentação | esta skill (`references/`) |
| Frontend | `Rolliude-front/` |
| Backend | `Rolliude-backend/src/modules/<dominio>/` |
| Banco | `Rolliude-backend/prisma/schema.prisma` + `prisma/migrations/` |
| Contrato HTTP | schemas Zod, OpenAPI em `GET /api/docs/openapi.json` |
| Tokens de UI | bloco `@theme` em `src/index.css` do front, valores em `references/design-system.md` |
| Componentes | `src/components/` do front |
| Ferramentas e versões | `package.json` + `yarn.lock` de cada pasta, lista em `references/tooling.md` |
| Runtime | `.nvmrc` (Node 20), `engines`, `docker-compose.yml`, CI |

Dois lugares dizendo coisas diferentes sobre o mesmo assunto: pare, siga a fonte oficial acima, corrija a outra e registre em `references/decisions.md` se for decisão estrutural.

## Implementar uma task

Toda implementação (pedida direto ou vinda de um plano aprovado em `/rolliude-planning` ou `/rolliude-planning-review`) segue `references/implementation-workflow.md` do começo ao fim: entender a task, conferir Node 20, ler o padrão real, Design System com `/frontend-design` ou `/ui-ux-pro-max` quando houver UI, implementar sob a REGRA MÁXIMA, auditoria pelo subagent `rolliude-reviewer` (`.claude/agents/rolliude-reviewer.md`), validação HTTP com o backend rodando quando houver rota nova ou alterada, e relatório final com roteiro de teste manual, branch, commit e descrição de PR sugeridos. Nunca commitar nem dar push.

## Leia conforme a tarefa

- Implementação de qualquer task: `references/implementation-workflow.md`
- UI, cor, fonte, ícone, acessibilidade: `references/design-system.md`
- Tela, componente, chamada HTTP no front: `references/frontend.md`
- Rota, schema, service, model, migration: `references/backend-database-api.md`
- Ferramenta ou dependência nova: `references/tooling.md`
- Mudança de arquitetura ou de padrão: `references/decisions.md`
- Branch, commit, checks, sprint: `references/workflow.md`
- Texto de termos, perfis e estados por região: `references/cadastro-content.md`

## Regras obrigatórias

- Sem `any`, `as any`, `@ts-ignore`, `@ts-expect-error`.
- Sem comentários em arquivo de código tocado.
- Sem variável de uma letra, fora índice trivial de loop.
- Sem import ou variável sem uso, código morto ou `console.log`.
- Sem segredo no código e sem dado sensível em log.
- Toda entrada externa é validada (Zod no back).
- Sem fonte de verdade duplicada.
- Visual só com tokens do Design System: nada de `bg-[#hex]`, `font-['...']` ou cor, fonte, espaçamento e variante inventados.
- Ícones só lucide-react. Estilo só Tailwind (sem CSS Modules, sem estilo inline visual).
- Movimentação estrutural não muda comportamento, a menos que a tarefa peça.
- Rodar os checks do Yarn (`references/workflow.md`) antes de dar como pronto.
- Mudou regra, ferramenta, token ou contrato: atualizar esta skill no mesmo PR.

O script `Rolliude-backend/scripts/quality-check.mjs` reprova `any`, `@ts-ignore`, `console.log` e comentários no `yarn lint` do backend.

## Design System em uma linha

Fundo `#120D0A`, superfície `#23130B`, borda `#442315`, texto `#FAF6EE`, primária terracota `#C2410C`, destaque laranja `#EA580C`, estrela `#FCD34D`; títulos em Cinzel; `rounded-xl`; container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Detalhe e nomes dos tokens em `references/design-system.md`.

## Pendências conhecidas (não são padrão)

- CI do backend roda `format:check` e `typecheck`, não o `yarn lint` completo; o reviewer roda `yarn lint` localmente para compensar.
- Front sem tokens `@theme`: cerca de 120 hex avulsos em classes. Corrigir por arquivo tocado.
- `tsconfig.json` do front sem `strict`; `any` em `CatalogView.tsx` e `MovieDetailModal.tsx`; comentários do scaffold em vários arquivos.
- Herança do Google AI Studio no front: nome de pacote `react-example`, README do AI Studio, `metadata.json`, `motion`, `tsx` e `esbuild` sem uso, script `clean` citando `server.js`, front sem `.nvmrc`/`engines`.
- Fontes Outfit e Plus Jakarta Sans carregadas sem uso.
- Rotas de escrita do backend sem autenticação (decisão 006 ainda não implementada).
