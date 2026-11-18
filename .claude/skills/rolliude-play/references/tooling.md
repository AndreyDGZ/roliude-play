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
| motion | ^12.23.24 | animação | instalada sem uso; usar só para animação real, senão remover |
| autoprefixer, esbuild, tsx | dev | herança do scaffold | candidatos a remoção |
| `@types/node`, `@types/react`, `@types/react-dom` | dev | tipos | oficial |
| `fetch` nativo + `request` + `ApiError` em `src/services/api.ts` | n/a | cliente HTTP | oficial, não adicionar axios |
| `localStorage` | n/a | favoritos, chave `rolliude_favorites_v1` | oficial por ora |
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
| ts-node-dev | ^2.0.0 | `yarn dev` |
| TypeScript | ^5.9.3 | tipagem |
| `scripts/quality-check.mjs` | n/a | bloqueia `any`, `@ts-ignore`, `console.log` e comentários |

## Infra

| Ferramenta | Uso |
|---|---|
| Node `20` (`.nvmrc` na raiz), `engines: node >=20` | runtime |
| Yarn `1.22.22` | único gerenciador de pacotes; npm não é usado |
| `docker-compose.yml` na raiz | sobe postgres, backend (3333) e frontend (3000) |
| GitHub Actions `.github/workflows/ci.yml` | checks em push e PR para `master`: front (`yarn lint`, `yarn build`) e back (`format:check`, `typecheck`, `prisma:validate`, `build`) |
| Prettier (`.prettierrc.json`) e `.editorconfig` na raiz | formatação |
| ClickUp | gestão de tasks (limite de 100 chamadas por dia na integração) |
