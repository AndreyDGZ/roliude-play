# Fluxo de implementação

Roteiro obrigatório para implementar qualquer task no Rolliúde Play, do entendimento até a entrega final. Vale para task vinda de `/rolliude-planning`, de `/rolliude-planning-review` ou pedida direto.

Anuncie cada etapa no chat com o emoji indicado, curto e direto.

## 1. 🎯 Entender a task

Entenda a task. Se ela veio de um plano aprovado, o plano é a especificação: não amplie escopo.

## 2. 📂 Identificar as pastas alvo

`Rolliude-front/`, `Rolliude-backend/` ou as duas. Confira a estrutura real com `ls` antes de citar caminhos.

## 3. 🔧 Conferir a versão do Node

Node 20 nas duas pastas (`.nvmrc`). Rode `node -v`; se não for 20, rode `nvm use 20` e anuncie: "🔧 Rodando `nvm use 20`...".

## 4. 📖 Ler o padrão antes de codar

Nesta ordem de prioridade:

1. **Código real:** 2 ou 3 arquivos existentes na mesma camada (outro módulo em `src/modules/`, outro componente em `src/components/`). Sempre prevalece.
2. **Fontes da verdade** (tabela abaixo): antes de declarar qualquer literal, regex, limite ou helper, confira se já existe.
3. **Referências desta skill:** `frontend.md`, `backend-database-api.md`, `design-system.md`, `decisions.md`.

### Se a task envolver UI do front

a) 🎨 **Invocar `/frontend-design` e/ou `/ui-ux-pro-max`.** Obrigatório.

b) 🔍 **Procurar referência visual.** Vasculhe o repositório por wireframe, mockup ou imagem relacionada à task. O anúncio do resultado é obrigatório:
- "📐 Referência visual encontrada: `<caminho>`, usando junto do Design System."
- "📐 Nenhuma referência visual encontrada, seguindo código real + Design System."

c) **Design System:** `design-system.md`. Só tokens do `@theme`, `rounded-xl`, container padrão, Cinzel em título, lucide-react. Arquivo tocado com hex avulso: trocar pelo token mais próximo.

d) **Padrões de UI já adotados (reaproveitar, nunca reinventar):**
- Tela nova é aba nova no estado do `App.tsx`, com rótulo no `Header.tsx`. Sem router.
- Toda tela que carrega dado tem estado de carregando, de erro com "tentar de novo" e de lista vazia.
- Detalhe abre em modal (`MovieDetailModal`, `ProfessionalModal`), não em tela nova.
- HTTP só por `src/services/api.ts`: `request<Tipo>()`, `ApiError`, tipo `Api*` convertido por `map*`.
- Favoritos via `useFavorites` (`localStorage` com try/catch).
- Acessibilidade: foco visível, `aria-label` em português em botão só com ícone, `alt` em imagem.

## 5. 💻 Implementar

Seguindo o passo 4 e a REGRA MÁXIMA abaixo, inegociável em qualquer tamanho de task.

### REGRA MÁXIMA: qualidade de código

Antes de dar a implementação como pronta, releia esta seção e confira o código linha a linha.

**1. Zero `any`.** Proibido `any`, `as any`, `@ts-ignore`, `@ts-expect-error`. Tipo desconhecido: `unknown` + narrowing, generics ou `interface`/`type` nomeado. No back, tipo de entrada vem de `z.infer` do schema Zod.

**2. Zero comentário.** Nenhum: nem "porquê", nem TODO. Em arquivo tocado, remova os comentários que já existirem. Vontade de comentar é sinal de nome ruim: extraia função com nome claro.

**3. Zero variável de uma letra ou nome vago.** Exceção única: índice trivial de loop. Atenção em callback: `.map(movie => ...)`, `.catch(error => ...)`, nunca `.map(m => ...)`.

**4. Clean code.**
- Uma função, uma responsabilidade; acima de ~20 linhas, quebrar.
- Reuso antes de criar: procure helper, service, componente e constante existentes.
- Early return em vez de `if` aninhado.
- Sem código morto, import ou variável sem uso, `console.log`.

**5. Legibilidade acima de esperteza.**

**6. UI segue o Design System** (passo 4c). Nada de `bg-[#hex]`, `font-['...']`, `p-[13px]`.

**7. Nomenclatura no padrão do projeto.**
- Back: arquivos `<dominio>.controller.ts`, `.routes.ts`, `.schema.ts`, `.service.ts`, `.mapper.ts`. Funções de service dizem o que fazem e com qual recorte (`listMovies`, `findMovieById`, `createReviewForMovie`), nunca `get`, `handle`, `process`, `data` soltos.
- Banco: model e campo em camelCase português no Prisma, tabela e coluna em snake_case com `@map`/`@@map`.
- Front: componente `export const Nome: React.FC<Props>` em PascalCase; campos de domínio em português (`titulo`), handlers em inglês (`handleToggleFavorite`).
- Renomeou: atualize todas as referências.

**8. Ordem dentro do componente React:** estados (`useState`, `useRef`), funções de carregamento, `useEffect`, valores derivados (`useMemo`), handlers e renderização. Confira o componente inteiro, não só o trecho alterado.

**9. Zero hardcode de domínio (fonte única da verdade, bloqueante).**
- Valor de domínio (classificação indicativa, região, gênero, ordenação, limite de paginação) vem da constante ou enum existente, nunca de string ou número solto.
- Erro de regra no back: `new AppError(mensagem, status)`, mensagem em português, sempre passando pelo `errorHandler`.
- Busca e normalização de texto: helpers de `src/shared/search/search-text.ts`, nunca `.normalize('NFD')` local.
- Front nunca lê `import.meta.env` fora de `api.ts`, nunca chama `fetch` fora de `api.ts`.
- Lista de valores permitidos declarada uma vez (`as const` no schema) e importada pelos consumidores.
- Valor de domínio novo nasce no arquivo centralizado do domínio, não no componente ou service que o usa.
- Arquivo tocado com hardcode pré-existente: corrigir junto.

#### Fontes da verdade: `Rolliude-backend`

| Propósito | Arquivo | Símbolos |
|---|---|---|
| Erro de regra | `src/shared/errors/app-error.ts` | `AppError` |
| Tratamento e formato de erro | `src/shared/errors/error-handler.ts`, `error-response.schema.ts` | `errorHandler`, `errorResponseSchema`, `ErrorResponse` |
| Busca e normalização | `src/shared/search/search-text.ts` | `normalizeSearchText`, `buildSearchField`, `buildSearchTokens` |
| Token de recuperação | `src/utils/reset-token.ts` | `generatePasswordResetToken`, `hashPasswordResetToken` |
| Variáveis de ambiente | `src/config/env.ts` | `env` validado com Zod |
| Cliente do banco | `src/config/prisma.ts` | PrismaClient único |
| Classificação e paginação de filmes | `src/modules/movies/movie.schema.ts` | `CLASSIFICACOES_INDICATIVAS`, limites de página |
| Enums do banco | `@prisma/client` | `ClassificacaoIndicativa` |
| Contrato HTTP | `src/modules/docs/openapi.ts` | OpenAPI gerado do Zod |
| Eventos e Kafka | `src/shared/events/` | `eventBus`, `releaseEventSchema`, `RELEASE_EVENT_TYPE` |
| Janela e paginação de notificações | `src/modules/notifications/notification.schema.ts` | `NOTIFICATIONS_WINDOW_DAYS`, `MISSED_NOTIFICATIONS_LIMIT` |
| Autenticação e permissão | `src/shared/auth/` | `signAccessToken`, `authenticate`, `requireAdmin`, `adminOnly`, `authenticatedUserSelect` |
| Senha | `src/shared/auth/password.ts` | tamanho mínimo e máximo, rounds, hash e comparação |
| Papéis e resposta de usuário | `src/modules/auth/auth.schema.ts`, `auth.mapper.ts`; enum `PapelUsuario` | `PAPEIS_USUARIO`, `toUserResponse` |

#### Fontes da verdade: `Rolliude-front`

| Propósito | Arquivo | Símbolos |
|---|---|---|
| HTTP e erro de API | `src/services/api.ts` | `request`, `ApiError`, `getMovies`, `getMovieById`, `createMovie`, `createReview`, `getProfessionals`, `getBehindTheScenesItems` |
| Tipos de domínio | `src/types/index.ts` | `Movie`, `Review`, `Professional`, `BehindTheScenesItem`, `Region`, `AgeRating` |
| Listas estáticas | `src/data/mockData.ts` | `STATES_LIST`, `MUNICIPALITIES_LIST`, `GENRES_LIST` |
| Lançamentos e tag "Novo" | `src/data/releases.ts` | `NEW_RELEASE_WINDOW_DAYS`, `isNewRelease`, `formatReleaseTime` |
| Notificações | `src/hooks/useNotifications.ts` | `useNotifications` |
| Favoritos | `src/hooks/useFavorites.ts` | `useFavorites`, `FavoritesState` |
| Sessão e login | `src/hooks/useAuth.ts`, `src/services/api.ts` | `useAuth`, `getStoredToken`, `storeToken`, `clearStoredToken`, `setUnauthorizedHandler` |
| Papéis, funções e tipos de bastidores | `src/data/mockData.ts` | `USER_ROLES`, `PROFESSIONAL_ROLES`, `BEHIND_THE_SCENES_TYPES` |
| Classificação, regiões e país do cadastro de filme | `src/data/mockData.ts` | `AGE_RATING_OPTIONS`, `REGIONS_LIST`, `DEFAULT_COUNTRY` |
| Abas | `src/types/index.ts` | `AppTab` |
| Tokens visuais | `src/index.css` | bloco `@theme` |
| Marca e padrão cordel | `src/components/Logo.tsx`, `CordelPattern.tsx` | `Logo`, `CordelPattern` |

Ao criar uma fonte nova (constante, helper), acrescente a linha nesta tabela no mesmo PR.

## 6. 🧪 Testes

O projeto ainda não tem infra de teste (`yarn test` do back só roda `typecheck`; o front não tem script). Não instale framework de teste por conta própria: isso exige decisão em `decisions.md`. Nesta etapa:
- Liste os cenários críticos que deveriam ter teste e leve para "Gaps" do relatório.
- A validação real fica nos checks do passo 7 e na validação HTTP do passo 8.

## 7. 🕵️ Auditoria pelo `rolliude-reviewer`

Anuncie: "🕵️ Agent `rolliude-reviewer` chamado, auditando a implementação...". Invoque o subagent `rolliude-reviewer` (Agent tool), passando a descrição da task e as pastas e arquivos alterados. Ele roda os checks do Yarn, corrige o que achar e devolve um parecer bruto. Aguarde o parecer antes de seguir.

## 8. 🚀 Validar contra o backend rodando

Só roda se `Rolliude-backend` foi afetado (rota nova ou alterada). Senão, anuncie: "🚀 Nenhuma rota do backend alterada, pulando validação HTTP.".

Antes de subir, `yarn lint` e `yarn build` no back limpos (o reviewer já roda, confirme).

### 🔒 Checagem de segurança antes de subir

```bash
cd "Rolliude-backend"
grep -E '^(PORT|DATABASE_URL)=' .env
```

- `DATABASE_URL` tem que apontar para o Postgres local do `docker-compose.yml` (`localhost:5432/rolliude_play`). Host ou banco estranho: pare e avise.
- Nunca imprima senha ou segredo no chat além do que já está no `.env.example`.
- Anuncie: "🔒 Checagem de segurança: banco local confirmado."

### Passos

1. Anuncie: "🚀 Subindo `Rolliude-backend` para validar...".
2. Postgres de pé: `docker compose up -d postgres` na raiz. Migration pendente: `npx prisma migrate deploy` (nunca `migrate reset`).
3. Libere a porta 3333 (Windows): `netstat -ano | findstr :3333` e `taskkill /PID <pid> /F /T` para cada PID encontrado.
4. Suba em segundo plano (Bash com `run_in_background`): `cd Rolliude-backend && yarn dev > "$TEMP/rolliude-backend-dev.log" 2>&1`.
5. Espere a porta escutar (`curl -s http://localhost:3333/api/docs/openapi.json` respondendo). Se não subir, leia o log, corrija e recomece do passo 3.
6. Dispare `curl` reais contra exatamente as rotas da task, com payload realista e também um payload inválido (confirma o 400 com `errors: [{ field, message }]`). Rota protegida: faça login (`POST /api/auth/login`, admin do `.env`) e envie `Authorization: Bearer <token>`; confirme também o 401 sem token e o 403 com usuário comum. Problema encontrado: corrija seguindo a REGRA MÁXIMA e repita.
7. **Derrube o backend, sempre, com sucesso ou falha:** pare a tarefa em segundo plano e rode de novo `netstat -ano | findstr :3333` + `taskkill /PID <pid> /F /T`.
8. **Confirme que parou:** `netstat -ano | findstr :3333` tem que voltar vazio. Nunca deixe o backend rodando ao fim.
9. Anuncie: "✅ Validação HTTP: `<método> <rota>` respondeu como esperado e o servidor foi desligado." (liste todas).

## 9. 📋 Relatório final

O `rolliude-reviewer` devolve só o parecer bruto; quem monta a entrega é este fluxo. Sempre nesta ordem, com `---` entre as seções:

1. **Resumo direto** do que foi feito, em linguagem não técnica.
2. **🤖 rolliude-reviewer:** achados e correções aplicadas (ou "nenhum problema encontrado").
3. **💡 Gaps identificados** (só se houver): melhoria estrutural fora dos arquivos tocados e cenários de teste que faltam por não haver infra. Hardcode em arquivo tocado **não é gap**: é violação da regra 9 e já tem que estar corrigido.
4. **✅ Verificação:** resultado dos checks do Yarn e da validação HTTP.
5. **Arquivos principais alterados.**
6. **🧭 Roteiro de teste manual**, um bloco por parte da task, linha em branco entre passos:
   ```
   🧭 Roteiro de teste manual

   NOME DA PARTE
   -----------------------
   1️⃣ Subir: docker compose up -d postgres, yarn dev no back e no front, abrir http://localhost:3000

   2️⃣ Caminho: Aba "<nome>" → "<ação>" → "<próxima ação>"

   3️⃣ O que validar: <resultado esperado específico>
   ```
   Consulte o banco local antes (ex.: filme real cadastrado pelo seed) e cite dado real no roteiro, nunca placeholder.
7. **Branch sugerida** (inglês), a partir da `master`:
   ```bash
   git checkout -b feature/<short-description>
   ```
8. **Commit sugerido por pasta** (inglês, Conventional Commits, uma linha), precedido do nome da pasta:
   ```
   Rolliude-backend:
   ```
   ```bash
   git commit -m "feat(backend): add reviews listing by movie"
   ```
9. **Lembrete do Node** usado (20).
10. **📋 Descrição do PR**, um bloco ` ```markdown ` por pasta afetada, precedido do nome da pasta. Título `## [<ID da task>]` quando o usuário citou um ID na conversa, senão `## [FIX EXTRA]`. Só bullets, cada um começando com emoji, linguagem não técnica primeiro e impacto para o usuário antes do detalhe interno. Sem link e sem pendência.

    Depois, pergunte via `AskUserQuestion`: "🗺️ Quer que eu adicione um diagrama explicando o fluxo da feature na descrição do PR?", opções "🗺️ Sim, adicionar diagrama" (Recomendado) e "🚫 Não, só os bullets". Se sim, gere diagrama ASCII em bloco `## 🗺️ Diagramas` separado, com fence externo de 4 crases e o diagrama em fence interno de 3; tabela fica fora do fence interno.

11. **Atualização da skill:** se a task mudou regra, ferramenta, token, contrato ou criou fonte da verdade, confirme que esta skill (e `decisions.md`, se estrutural) foi atualizada no mesmo PR.

Nunca rode `git commit` ou `git push`: só sugira.
