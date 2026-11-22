# Ferramentas oficiais

Lista única de ferramentas do Rolliúde Play. Versões conferidas nos `package.json` reais. Ferramenta nova só entra depois de registrada aqui e em `decisions.md`.

## Frontend (`Rolliude-front/`)

| Ferramenta | Versão | Uso | Status |
|---|---|---|---|
| React / React DOM | ^19.0.1 | telas | oficial |
| Vite + `@vitejs/plugin-react` | ^8.3.0 / ^6.1.1 | dev server (`yarn dev`, porta 3000) e build | oficial |
| TypeScript | ^7.0.2 | tipagem, `yarn lint` = `tsc --noEmit` | oficial, falta ligar `strict` |
| Tailwind CSS v4 + `@tailwindcss/vite` | ^4.3.3 | estilo por classes utilitárias, tokens em `@theme` no `src/index.css` | oficial |
| lucide-react | ^0.546.0 | ícones | oficial e única lib de ícones |
| Google Fonts: Cinzel | 600, 700, 800, 900 | títulos e marca | oficial |
| Google Fonts: Outfit, Plus Jakarta Sans | carregadas no `index.html` | sem uso no código | pendente: adotar uma como fonte de corpo ou remover |
| motion | ^12.23.24 | animação de sininho, painel, toast e tag "Novo" (sempre com `useReducedMotion`) | oficial |
| autoprefixer, esbuild, tsx | dev | herança do scaffold | candidatos a remoção |
| `@types/node`, `@types/react`, `@types/react-dom` | dev | tipos | oficial |
| `fetch` nativo + `request` + `ApiError` em `src/services/api.ts` | n/a | cliente HTTP | oficial, não adicionar axios |
| `localStorage` | n/a | favoritos (`rolliude_favorites_v1`) e id do dispositivo das notificações (`rolliude_dispositivo_v1`) | oficial por ora |
| `EventSource` nativo | n/a | canal em tempo real de notificações, aberto só por `openNotificationStream` em `api.ts` | oficial |
| `VITE_API_BASE_URL` (`.env.example`) | n/a | endereço da API, padrão `http://localhost:3333/api` | oficial |
| Alias `@/*` | n/a | import curto, definido em `vite.config.ts` e `tsconfig.json` | oficial |
| Google AI Studio | n/a | origem do protótipo (`metadata.json`, README, `DISABLE_HMR`, `GEMINI_API_KEY`) | herança; não há Gemini no código |

## Backend (`Rolliude-backend/`)

| Ferramenta | Versão | Uso |
|---|---|---|
| Express | ^5.2.1 | servidor HTTP |
| Zod | ^4.6.5 | validação de entrada e de ambiente, origem do OpenAPI |
| Prisma + `@prisma/client` | ^6.12.0 | ORM e migrations |
| PostgreSQL 15 + extensão `pg_trgm` | docker | banco e busca por trecho de texto |
| cors, dotenv | ^2.8.6 / ^17.4.2 | CORS e variáveis de ambiente |
| kafkajs | ^2.2.4 | producer e consumers do Kafka (`src/shared/events/kafka-event-bus.ts`) |
| bcryptjs | ^3 | hash de senha (custo 10) em `modules/auth` e no seed do admin |
| jsonwebtoken | ^9 | JWT HS256 em `src/shared/auth/access-token.ts` |
| ts-node-dev | ^2.0.0 | `yarn dev` |
| TypeScript | ^5.9.3 | tipagem |
| `scripts/quality-check.mjs` | n/a | bloqueia `any`, `@ts-ignore`, `console.log` e comentários |

## Infra

| Ferramenta | Uso |
|---|---|
| Node `20` (`.nvmrc` na raiz), `engines: node >=20` | runtime |
| Yarn `1.22.22` | único gerenciador de pacotes; npm não é usado |
| `render.yaml` na raiz | blueprint do backend no Render free (decisão 015) |
| Cloudflare Workers (static assets) + `wrangler` | hospedagem do front, build e deploy configurados no painel (decisão 015) |
| Neon | Postgres gerenciado de produção (decisão 015) |
| `docker-compose.yml` na raiz | sobe postgres, kafka (KRaft, 9092 externo e 29092 interno), kafka-ui (8080), backend (3333) e frontend (3000) |
| GitHub Actions `.github/workflows/ci.yml` | checks em push e PR para `master`: front (`yarn lint`, `yarn build`) e back (`format:check`, `typecheck`, `prisma:validate`, `build`) |
| Prettier (`.prettierrc.json`) e `.editorconfig` na raiz | formatação |
| ClickUp | gestão de tasks (limite de 100 chamadas por dia na integração) |
