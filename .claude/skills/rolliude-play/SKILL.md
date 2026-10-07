---
name: rolliude-play
metadata:
  project: "Rolliude Play"
  stack: "React + TypeScript (Vite) · CSS Modules · Node.js + Express · PostgreSQL via Prisma"
description: >-
  How to work inside the Rolliude Play repository without inventing conventions
  that already exist somewhere else in the project. Covers: where the
  canonical source of truth lives for product vision, database schema, HTTP
  contracts, UI tokens, UI components, runtime versions, dependencies, git
  flow and agent instructions; the mandatory coding rules from AGENTS.md (no
  `any`/`as any`/`@ts-ignore`/`@ts-expect-error`, no comments in touched
  files, no one-letter variables, no duplicate sources of truth, no inventing
  UI colors/fonts/spacing/variants); the real Design System tokens (brand
  colors, Rye/Montserrat fonts, spacing/radius scale) and that styling is CSS
  Modules + CSS variables, not Tailwind; the backend's modular folder pattern
  under `src/modules/<domain>/` versus the legacy `src/controllers|routes|schemas|services/`
  structure; Prisma as the only valid source for schema/migrations; and the
  sprint/ClickUp delivery workflow. Use when adding or changing a React
  component, a CSS/style value, an Express route or controller, a Prisma
  model or migration, or anything else inside this repo, before writing code
  that could reinvent a rule, a color, a folder pattern or a table that
  already has a canonical home. Triggers on: "Rolliude Play", "Rolliúde
  Play", "AGENTS.md", "authority-map", "project-standards", "ADR-00", "design
  system", "tokens.css", "designTokens", "--brand-orange", "--brand-ink",
  "Rye", "Montserrat", "CSS Modules", "Tailwind", "schema.prisma", "Prisma
  migration", "novo componente", "nova rota", "novo controller", "sprint",
  "ClickUp", "Rolliude-front", "Rolliude-backend", "Rolliude-project".
---

# Trabalhando no repositório Rolliude Play

## Modelo mental

Rolliude Play não é uma lib com uma API própria — é um monorepo com três pastas
de primeiro nível (`Rolliude-front/`, `Rolliude-backend/`, `Rolliude-project/`)
e uma regra única acima de tudo: **para quase todo assunto existe exatamente
um arquivo que é a fonte de verdade**, listado em
`Rolliude-project/project-standards/01-authority-map.md`. Qualquer outro lugar
onde o mesmo valor apareça (uma cor copiada dentro de um componente, um tipo
de frontend que diverge do schema de validação do backend, um SQL solto fora
do Prisma) é, por definição, não canônico — mesmo que esteja funcionando.

O ponto de entrada de qualquer tarefa é sempre o mesmo, na ordem:

1. `AGENTS.md` (raiz do repo) — regras obrigatórias.
2. `Rolliude-project/project-standards/01-authority-map.md` — identificar a
   área afetada.
3. O arquivo de padrão correspondente em `project-standards/02..09-*.md`.
4. As ADRs aceitas em `Rolliude-project/docs/architecture/adr/` relevantes
   para essa área.

## Princípios norteadores

- **Nunca inventar, sempre localizar.** Antes de escrever uma cor, uma rota,
  uma tabela ou uma regra de negócio, pergunte "onde é a fonte canônica
  disso?" usando o mapa de autoridade. Se a resposta não está clara, isso é
  sinal para parar e perguntar, não para decidir sozinho.
- **Divergência para o ADR, não para o código.** Se dois lugares do repo
  dizem coisas diferentes sobre o mesmo assunto (ex.: um componente com cor
  hardcoded diferente do token oficial), o `01-authority-map.md` manda: parar
  a implementação afetada, identificar a fonte canônica, documentar a decisão
  estrutural em uma ADR se for arquitetural, corrigir a fonte não canônica, e
  só então continuar.

## Mapa de autoridade (resumo)

| Assunto | Fonte canônica | Não é canônico |
|---|---|---|
| Visão de produto | `Rolliude-project/docs/product/vision.md` | README, mensagens de chat |
| MVP atual | `Rolliude-project/docs/product/mvp.md` | documentos históricos de sprint |
| Requisitos | `Rolliude-project/docs/product/requirements.md` | notas informais de implementação |
| Decisões de arquitetura | ADRs aceitas em `Rolliude-project/docs/architecture/adr/` | mensagens de chat |
| Banco de dados | `Rolliude-backend/prisma/schema.prisma` + `Rolliude-backend/prisma/migrations/` | SQL solto ou documentos históricos de sprint |
| Contrato HTTP | schemas de rota do backend + OpenAPI gerado | tipos de frontend manuais que divergem |
| Tokens de UI | `Rolliude-front/src/styles/tokens.css` | valores copiados dentro de componentes |
| Componentes de UI | `Rolliude-front/src/components/ui/` | implementações duplicadas locais à página |
| Runtime | `.nvmrc`, `engines` do `package.json`, Docker e CI | valores só no README |
| Dependências | `package.json` + `yarn.lock` oficiais | listas de dependências copiadas |
| Fluxo de Git | `Rolliude-project/CONTRIBUTING.md` | mensagens de grupo |
| Instruções de agente | `AGENTS.md` + `Rolliude-project/project-standards/` | cópias independentes de regras de IA |

## Regras obrigatórias (de `AGENTS.md`)

- Não introduzir `any`, `as any`, `@ts-ignore` ou `@ts-expect-error`.
- Não deixar comentários em arquivos de código tocados.
- Não usar variáveis de uma letra, exceto índices triviais de loop.
- Não criar fontes de verdade duplicadas.
- Não inventar cores, fontes, espaçamentos ou variantes de componente fora do
  Design System.
- Manter o comportamento inalterado durante movimentações estruturais, a
  menos que a tarefa peça explicitamente mudança de comportamento.
- Rodar os checks relevantes do Yarn antes de marcar o trabalho como
  concluído.

### Regra que morde

Essas regras valem mesmo quando o código "funciona" — `any` que compila e
uma cor hardcoded que renderiza certo ainda violam a regra. Rodar o check do
Yarn é o que pega isso antes do code review, não depois.

## Design System: tokens reais, não inventados

Os tokens já existem em `Rolliude-front/src/styles/tokens.css` (CSS custom
properties no `:root`) e não devem ser copiados como valores literais dentro
de componentes — sempre referenciar a variável.

```css
--brand-background: #f9f5eb;
--brand-ink: #241a10;
--brand-orange: #ff9200;
--brand-terracotta: #c84b31;
--brand-yellow: #ffd23f;
--font-display: Rye, Georgia, serif;
--font-body: Montserrat, Arial, sans-serif;
```

Além das cores de marca, existem aliases semânticos (`--color-page-bg`,
`--color-action-primary-bg`, `--color-danger-text`, etc.) e escalas de
`--radius-*` e `--space-*`. Use o alias semântico quando ele existir em vez
da cor de marca bruta (ex.: `--color-action-primary-bg`, não
`--brand-orange`, dentro de um botão).

### Regra que morde

Este projeto **não usa Tailwind** — a estratégia de estilo (ver
`ADR-003-styling-strategy.md`) é CSS Modules (`*.module.css`) consumindo essas
CSS variables. Não adicione configuração do Tailwind nem escreva classes
utilitárias esperando que exista um `tailwind.config` — ele não existe neste
repo.

## Frontend (`Rolliude-front/`)

- Stack: React + TypeScript, build com Vite.
- Estilo: CSS Modules por componente (`Component.tsx` + `Component.module.css`),
  nunca estilo inline com valores de cor/fonte/espaçamento fora dos tokens.
- Componentes de UI reutilizáveis já existem em
  `Rolliude-front/src/components/ui/` (ex.: `Button.tsx`, `TextField.tsx`,
  cada um com seu `.module.css`). Antes de criar um componente novo, procure
  ali — recriar um botão ou campo de texto do zero numa página é a duplicação
  que `01-authority-map.md` chama de "implementação duplicada local à
  página".
- Leia `project-standards/03-frontend.md` para padrões de estrutura de
  pastas/rotas e `project-standards/07-ui-accessibility.md` antes de criar
  qualquer componente novo de UI.

## Backend (`Rolliude-backend/`)

- Stack: Node.js + Express, banco PostgreSQL via Prisma.
- Todo o backend segue o padrão modular
  (`src/modules/<domínio>/{<domínio>.controller,<domínio>.routes,<domínio>.schema,<domínio>.service}.ts`,
  ex. `src/modules/auth/`, `src/modules/users/`, `src/modules/notifications/`).
  Uma estrutura legada paralela (`src/controllers/`, `src/routes/`,
  `src/schemas/`, `src/services/`), feita só de shims de uma linha
  reexportando o código modular, existiu neste repo e foi removida numa
  reorganização — não recrie esse padrão plano por camada técnica.
- Leia `project-standards/04-backend.md` e `project-standards/06-api-auth.md`
  antes de decidir onde colocar um controller, rota ou schema novo.

### Regra que morde

Código novo vai sempre em `src/modules/<domínio>/`, nunca em uma pasta plana
por camada técnica (`controllers/`, `services/`, etc. na raiz de `src/`).
Isso recriaria exatamente a "fonte de verdade duplicada" que `AGENTS.md`
proíbe e que já foi limpa deste repo.

## Banco de dados

- Fonte canônica única: `Rolliude-backend/prisma/schema.prisma` +
  `Rolliude-backend/prisma/migrations/`.
- Qualquer SQL solto fora dessa pasta (scripts `.sql` na raiz do repo,
  arquivos `database.ts` ad-hoc) é não canônico — não parta desses arquivos
  nem os trate como fonte de verdade; se existirem, são candidatos a
  reconciliação ou remoção, não a extensão.
- Leia `project-standards/05-database.md` antes de criar uma migration.

## Qualidade, segurança e documentação

- `project-standards/08-quality-security.md` cobre padrões de qualidade e
  segurança que se aplicam antes de qualquer PR.
- `project-standards/09-git-documentation.md` cobre convenções de commit/PR e
  documentação; o fluxo de Git canônico vive em
  `Rolliude-project/CONTRIBUTING.md`.

## Metodologia de sprint e ClickUp

- Projeto organizado em 12 sprints (Sprint 0–11), entregas semanais às
  quartas-feiras, metodologia Scrum/Kanban híbrida com tiers de prioridade
  urgent → high → normal → low.
- Gestão de tarefas no ClickUp; a integração tem limite rígido de 100
  chamadas/dia — sessões grandes de criação de tasks podem precisar continuar
  no dia seguinte.
- Relatórios de sprint para compartilhamento no WhatsApp são sempre em PDF,
  não HTML, seguindo o template editorial com paleta verde/creme, linha do
  tempo e badges — isso é convenção de comunicação da equipe, não parte do
  Design System do produto (não confundir as duas paletas).

## Pitfalls conhecidos neste repo

- Uma reorganização removeu protótipos e arquivos órfãos que haviam se
  acumulado na raiz (um módulo de auth antigo com `package.json`/`tsconfig.json`/
  `database.ts`/`usuarios.sql` próprios, uma pasta `backend/` com um
  `server.ts` incompleto, e um projeto Vite standalone de protótipo de tela
  de cadastro) e os shims legados do backend (`src/controllers/`,
  `src/routes/`, `src/schemas/`, parte de `src/services/`). Não recrie esse
  padrão: qualquer arquivo de configuração, SQL ou scaffold de app solto na
  raiz do repo, fora de `.claude/`, `Rolliude-backend/`, `Rolliude-front/` ou
  `Rolliude-project/`, é sinal de que algo não passou pela fonte canônica.
- Conteúdo de produto que ainda não foi integrado ao fluxo real (ex.: texto
  de termos de uso e lista de estados/regiões do protótipo de cadastro
  removido) fica em `Rolliude-project/docs/product/cadastro-content-reference.md`
  como referência — não é código, não deve ser tratado como implementação
  pronta, e integrá-lo ao `Cadastro.tsx` real exige uma feature própria
  (schema do `Usuario` no Prisma não tem campos de estado/município/perfil
  ainda).
- O documento de planejamento original (~40 páginas em PDF) e seus diagramas
  ainda referenciam a paleta antiga (vermelho/preto/dourado) — se você vir
  essas cores em qualquer lugar fora de material histórico, é desalinhamento
  com o Design System oficial, não uma variante válida.

## O que esta skill não decide

- Não substitui a leitura da ADR específica da área que você está mudando —
  esta skill indexa onde elas estão, não resume o conteúdo de cada decisão.
- Não aprova mudança de paleta, tipografia ou criação de nova variante de
  componente — isso é decisão de Design System/Product Owner, documentada
  via ADR, não algo para o agente inferir sozinho.
- Não resolve divergências entre fontes por conta própria — segue a regra do
  `01-authority-map.md`: parar, identificar a fonte canônica, documentar em
  ADR se for estrutural, corrigir a fonte não canônica, então continuar.
