# Frontend

Pasta: `Rolliude-front/`. Stack e versões em `tooling.md`, visual em `design-system.md`.

## Estrutura

```
index.html            fontes do Google e classes do body
src/main.tsx          monta o App
src/App.tsx           estado global, abas e modais
src/index.css         Tailwind e bloco @theme
src/components/       um componente por arquivo, PascalCase
src/services/api.ts   única porta de saída HTTP
src/types/index.ts    tipos de domínio
src/data/mockData.ts  listas estáticas (estados, municípios, gêneros)
src/data/releases.ts  janela de "Novo" (NEW_RELEASE_WINDOW_DAYS) e tempo relativo
src/hooks/            hooks de estado compartilhado (useNotifications)
```

## Navegação

Não há router. `App.tsx` troca a aba ativa: `inicio`, `catalogo`, `curadoria`, `bastidores`, `profissionais`, `favoritos`. Os rótulos ficam em `Header.tsx`. Tela nova = aba nova nesse mesmo estado, até existir decisão de adotar router.

Modais existentes: `MovieDetailModal` (ficha técnica e avaliações), `ProfessionalModal`, `VideoPlayerModal`, `AdminAddMovieModal`.

## Regras

- Componente: `export const Nome: React.FC<Props>`; só o `App` é default export.
- Antes de criar componente, procure em `src/components/` um que já resolva (`MovieCard`, `CordelPattern`, `Logo`).
- HTTP só por `src/services/api.ts`: use `request<Tipo>()` e trate `ApiError`. Resposta da API chega como tipo `Api*` e vira tipo de domínio por uma função `map*`. Componente nunca chama `fetch`.
- Tipos de domínio em `src/types/index.ts`, com nomes de campo em português (`titulo`, `sinopse`), handlers em inglês (`handleToggleFavorite`).
- Busca global leva para a aba `catalogo`.
- Toda tela que carrega dado tem estado de carregando, de erro com "tentar de novo" e de lista vazia.
- Favoritos: `localStorage`, chave `rolliude_favorites_v1`. Leitura e escrita protegidas com try/catch.

## Comandos

```bash
yarn install --frozen-lockfile
yarn dev        # porta 3000
yarn lint       # tsc --noEmit
yarn build
```
