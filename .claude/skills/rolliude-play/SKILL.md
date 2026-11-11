---
name: rolliude-play
metadata:
  project: "Rolliude Play"
  stack: "React + TypeScript (Vite) · CSS Modules · Node.js + Express · PostgreSQL via Prisma"
description: >-
  How to work inside the Rolliude Play repository without inventing conventions
  that already exist somewhere else in the project. Covers: where the
  canonical source of truth lives for database schema, HTTP contracts, UI
  tokens, UI components, runtime versions, dependencies, git flow and agent
  instructions; the mandatory coding rules from AGENTS.md (no
  `any`/`as any`/`@ts-ignore`/`@ts-expect-error`, no comments in touched
  files, no one-letter variables, no duplicate sources of truth, no inventing
  UI colors/fonts/spacing/variants); the real Design System tokens (brand
  colors, Rye/Montserrat fonts, spacing/radius scale) and that styling is CSS
  Modules + CSS variables, not Tailwind; the backend's modular folder pattern
  under `src/modules/<domain>/`; Prisma as the only valid source for
  schema/migrations; and the sprint/ClickUp delivery workflow. All project
  ADRs, standards, API contract reference and historical docs live under
  `references/` in this skill folder, not in a separate top-level
  `Rolliude-project/` anymore. Use when adding or changing a React
  component, a CSS/style value, an Express route or controller, a Prisma
  model or migration, or anything else inside this repo, before writing code
  that could reinvent a rule, a color, a folder pattern or a table that
  already has a canonical home. Triggers on: "Rolliude Play", "Rolliúde
  Play", "AGENTS.md", "authority-map", "ADR-00", "design system",
  "tokens.css", "designTokens", "--brand-orange", "--brand-ink", "Rye",
  "Montserrat", "CSS Modules", "Tailwind", "schema.prisma", "Prisma
  migration", "novo componente", "nova rota", "novo controller", "sprint",
  "ClickUp", "Rolliude-front", "Rolliude-backend".
---

# Trabalhando no repositório Rolliude Play

## Modelo mental

Rolliude Play não é uma lib com uma API própria — é um monorepo com duas
pastas de primeiro nível de código (`Rolliude-front/`, `Rolliude-backend/`)
mais esta skill, que concentra toda a documentação de projeto (ADRs,
padrões, fluxo de git, contrato de API, material histórico). Uma regra
única acima de tudo: **para quase todo assunto existe exatamente um arquivo
que é a fonte de verdade**, listado no mapa de autoridade abaixo. Qualquer
outro lugar onde o mesmo valor apareça (uma cor copiada dentro de um
componente, um tipo de frontend que diverge do schema de validação do
backend, um SQL solto fora do Prisma) é, por definição, não canônico — mesmo
que esteja funcionando.

O ponto de entrada de qualquer tarefa é sempre o mesmo, na ordem:

1. `AGENTS.md` (raiz do repo) — regras obrigatórias, hoje só um ponteiro
   pra esta skill.
2. Mapa de autoridade abaixo — identificar a área afetada.
3. `references/standards.md` — seção correspondente ao tema.
4. `references/adrs.md` — decisões aceitas relevantes pra essa área.

## Princípios norteadores

- **Nunca inventar, sempre localizar.** Antes de escrever uma cor, uma rota,
  uma tabela ou uma regra de negócio, pergunte "onde é a fonte canônica
  disso?" usando o mapa de autoridade. Se a resposta não está clara, isso é
  sinal para parar e perguntar, não para decidir sozinho.
- **Divergência para o ADR, não para o código.** Se dois lugares do repo
  dizem coisas diferentes sobre o mesmo assunto (ex.: um componente com cor
  hardcoded diferente do token oficial), a regra é: parar a implementação
  afetada, identificar a fonte canônica, documentar a decisão estrutural em
  uma ADR se for arquitetural, corrigir a fonte não canônica, e só então
  continuar.

## Mapa de autoridade (resumo)

| Assunto | Fonte canônica | Não é canônico |
|---|---|---|
| Decisões de arquitetura | `references/adrs.md` (ADRs aceitas) | mensagens de chat |
| Banco de dados | `Rolliude-backend/prisma/schema.prisma` + `Rolliude-backend/prisma/migrations/` | SQL solto ou documentos históricos de sprint |
| Contrato HTTP | schemas de rota do backend + OpenAPI gerado | `references/api-catalog.md` é guia de uso, não a fonte; tipos de frontend manuais que divergem tampouco são canônicos |
| Tokens de UI | `Rolliude-front/src/styles/tokens.css` | valores copiados dentro de componentes |
| Componentes de UI | `Rolliude-front/src/components/ui/` | implementações duplicadas locais à página |
| Runtime | `.nvmrc`, `engines` do `package.json`, Docker e CI | README-only values |
| Dependências | `package.json` + `yarn.lock` oficiais de cada repo | listas de dependências copiadas |
| Fluxo de Git | `references/git-workflow.md` | mensagens de grupo |
| Instruções de agente | `AGENTS.md` + esta skill | cópias independentes de regras de IA |

### Pendência conhecida (não inventar conteúdo pra preencher)

O mapa de autoridade antigo também citava `docs/product/vision.md`, `mvp.md`
e `requirements.md` como fonte canônica de visão de produto/MVP/requisitos.
**Nenhum dos três arquivos jamais existiu no repositório** — a pendência é
real e anterior a esta reorganização. Se alguém pedir a visão de
produto/MVP/requisitos formal, não existe documento pra apontar; não invente
o conteúdo desses arquivos, sinalize a lacuna.

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

Este projeto **não usa Tailwind** — a estratégia de estilo (ver ADR-003 em
`references/adrs.md`) é CSS Modules (`*.module.css`) consumindo essas CSS
variables. Não adicione configuração do Tailwind nem escreva classes
utilitárias esperando que exista um `tailwind.config` — ele não existe neste
repo.

## Frontend (`Rolliude-front/`)

- Stack: React + TypeScript, build com Vite.
- Estilo: CSS Modules por componente (`Component.tsx` + `Component.module.css`),
  nunca estilo inline (`style={{...}}`) com valores de cor/fonte/espaçamento
  fora dos tokens.
- Chamadas de API devem passar por `src/lib/http/` (camada HTTP genérica),
  nunca `fetch`/URL hardcoded direto num componente de página.
- Componentes de UI reutilizáveis já existem em
  `Rolliude-front/src/components/ui/` (ex.: `Button.tsx`, `TextField.tsx`,
  cada um com seu `.module.css`). Antes de criar um componente novo, procure
  ali — recriar um botão ou campo de texto do zero numa página é a
  duplicação que o mapa de autoridade chama de "implementação duplicada
  local à página".
- Leia `references/standards.md` seção 3 (frontend) e seção 7
  (UI/acessibilidade) antes de criar qualquer componente novo de UI.

## Backend (`Rolliude-backend/`)

- Stack: Node.js + Express, banco PostgreSQL via Prisma.
- Todo o backend segue o padrão modular
  (`src/modules/<domínio>/{<domínio>.controller,<domínio>.routes,<domínio>.schema,<domínio>.service}.ts`,
  ex. `src/modules/auth/`, `src/modules/users/`, `src/modules/notifications/`).
  Uma estrutura legada paralela (`src/controllers/`, `src/routes/`,
  `src/schemas/`, `src/services/`), feita só de shims de uma linha
  reexportando o código modular, existiu neste repo e foi removida numa
  reorganização — não recrie esse padrão plano por camada técnica.
- Leia `references/standards.md` seção 4 (backend) e seção 6 (API/auth)
  antes de decidir onde colocar um controller, rota ou schema novo.
- **Antes de criar um módulo novo de domínio, confirme que outro módulo não
  já cobre o mesmo domínio e está só desconectado de `app.ts`** — ver
  "Pitfalls conhecidos" abaixo sobre `modules/films/` vs `modules/movies/`.

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
- Depois de editar `schema.prisma` sem criar migration nova (ex. corrigindo
  um `@@map`/nome de campo que diverge do banco real), rode
  `npx prisma generate` antes de tocar em qualquer `.ts` que importe tipos
  do `@prisma/client` — não há `postinstall` configurado rodando isso
  sozinho.
- Antes de uma migration nova, valide com
  `npx prisma migrate diff --from-url <DATABASE_URL> --to-schema-datamodel prisma/schema.prisma --script`
  contra um banco de dev descartável: diff vazio confirma que
  `schema.prisma` e o banco real convergem.
- Leia `references/standards.md` seção 5 (banco de dados) antes de criar uma
  migration.

## Qualidade, segurança e documentação

- `references/standards.md` seção 8 cobre padrões de qualidade e segurança
  que se aplicam antes de qualquer PR.
- `references/standards.md` seção 9 e `references/git-workflow.md` cobrem
  convenções de commit/PR, documentação e o fluxo de Git canônico completo
  (branches, checks obrigatórios).

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

- **`modules/films/` vs `modules/movies/` (backend)**: existem duas
  implementações paralelas do mesmo domínio de catálogo. `modules/films/`
  tem schema de validação Zod, mapper com visibilidade por domínio público
  e busca dedicada (bate com `references/api-catalog.md` e as ADRs 007/009)
  — mas **nunca foi conectado em `src/app/app.ts`**. Quem roda de verdade
  hoje é `modules/movies/`, uma versão mais pobre do mesmo domínio, sem
  schema próprio nem mapper, e é nela que o frontend está cabeado. Antes de
  mexer em qualquer rota de filme/movie, confirme qual dos dois módulos
  você está realmente alterando e se o outro não devia ser removido/fundido
  primeiro.
- Uma reorganização anterior removeu protótipos e arquivos órfãos que
  haviam se acumulado na raiz (um módulo de auth antigo com
  `package.json`/`tsconfig.json`/`database.ts`/`usuarios.sql` próprios, uma
  pasta `backend/` com um `server.ts` incompleto, um projeto Vite standalone
  de protótipo de tela de cadastro, e os shims legados do backend
  `src/controllers/`, `src/routes/`, `src/schemas/`, parte de
  `src/services/`). Não recrie esse padrão: qualquer arquivo de
  configuração, SQL ou scaffold de app solto na raiz do repo, fora de
  `.claude/`, `Rolliude-backend/` ou `Rolliude-front/`, é sinal de que algo
  não passou pela fonte canônica.
- Conteúdo de produto que ainda não foi integrado ao fluxo real (textos de
  termos de uso e lista de estados/regiões do protótipo de cadastro
  removido) fica em `references/cadastro-content-reference.md` como
  referência — não é código, não deve ser tratado como implementação
  pronta, e integrá-lo ao `Cadastro.tsx` real exige uma feature própria
  (schema do `Usuario` no Prisma não tem campos de estado/município/perfil
  ainda).
- O documento de planejamento original (~40 páginas em PDF) e seus diagramas
  ainda referenciam a paleta antiga (vermelho/preto/dourado) — se você vir
  essas cores em qualquer lugar fora de material histórico, é desalinhamento
  com o Design System oficial, não uma variante válida.
- Já houve um commit (`d20db6d`, "fix: resolve erros do quality-check e
  limpa comentarios de linha") que, junto com limpezas legítimas, introduziu
  drift real sem ADR: renomeou enums/campos do `schema.prisma` sem gerar
  migration, e trocou código por versões com cor/URL hardcoded em vez de
  token/`src/lib/http/`. Um "fix de lint" grande mexendo em muitos arquivos
  de uma vez é sinal de atenção redobrada, não só confiança no nome do
  commit.

## O que esta skill não decide

- Não substitui a leitura da ADR específica da área que você está mudando —
  `references/adrs.md` indexa as decisões, não convida a pular a leitura
  antes de uma mudança arquitetural grande.
- Não aprova mudança de paleta, tipografia ou criação de nova variante de
  componente — isso é decisão de Design System/Product Owner, documentada
  via ADR, não algo para o agente inferir sozinho.
- Não resolve divergências entre fontes por conta própria — segue a regra
  do mapa de autoridade: parar, identificar a fonte canônica, documentar em
  ADR se for estrutural, corrigir a fonte não canônica, então continuar.

## Referências completas

- `references/adrs.md` — as 9 ADRs aceitas, condensadas por decisão.
- `references/standards.md` — os 9 temas de padrão de projeto.
- `references/git-workflow.md` — fluxo de contribuição e checks de PR.
- `references/api-catalog.md` — guia de uso do contrato de API de catálogo
  (com a nota de drift `films`/`movies` documentada).
- `references/schema-filmes-test.md` — relatório histórico de banco do
  Sprint 1 (não canônico, só pra saber o que é roadmap).
- `references/cadastro-content-reference.md` — conteúdo de produto do
  protótipo de cadastro removido, ainda não integrado ao código real.
