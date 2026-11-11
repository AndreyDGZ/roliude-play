# Guia da API de catálogo

O contrato HTTP é gerado a partir dos schemas Zod do backend e servido em
`GET /api/docs/openapi.json` (OpenAPI 3.1). Esse documento é canônico. Este
guia só explica como usá-lo e não repete definição de campo.

**Nota de drift conhecido**: este guia documenta `/api/films` e
`/api/admin/films` como os caminhos reais, com papéis `CURADOR` ou
`ADMINISTRADOR` liberados nas rotas administrativas. O código hoje em
produção serve o catálogo em `/api/movies`/`/api/admin/movies` (módulo
`modules/movies/`, mais pobre) e só libera `ADMINISTRADOR` nessas rotas — o
módulo `modules/films/`, que bate com este guia, está implementado mas
nunca foi conectado em `app.ts`. Ver "Pitfalls conhecidos" no `SKILL.md`.

## Endpoints públicos

| Method | Path | Propósito |
|---|---|---|
| GET | `/api/films` | Lista paginada de filmes publicados com busca e filtros |
| GET | `/api/films/{id}` | Detalhe de filme publicado |
| GET | `/api/genres` | Gêneros pra filtros e formulários |
| GET | `/api/locations/states` | Estados, opcionalmente filtrados por `regiao` |
| GET | `/api/locations/states/{uf}/municipalities` | Municípios de um estado |

### Busca e filtros

`GET /api/films` aceita, todos opcionais e combináveis:

- `busca`: texto livre. Sem distinção de acento/maiúscula, dividido em
  espaços (até 5 termos), cada termo precisa bater com título ou título
  original.
- `regiao`, `uf`, `municipioId`: filtros de localidade.
- `generoId`: filmes que têm o gênero.
- `ano`: ano de lançamento.
- `ordenar`: `recentes` (padrão), `titulo` ou `ano`.
- `pagina` (padrão 1) e `limite` (padrão 12, máximo 48).

Respostas usam `{ data, meta }` onde `meta` tem `pagina`, `limite`, `total`
e `totalPaginas`.

### Exposição de vídeo

`videoUrl` só é devolvido ao público quando o filme tem `dominioPublico`
true. Caso contrário é `null`. Armazenamento de mídia grande e streaming
continuam governados pela ADR-007.

## Endpoints administrativos

Todas as rotas sob `/api/admin/films` exigem `Authorization: Bearer <token>`
de `POST /api/auth/login` e um usuário cujo `papel` seja `CURADOR` ou
`ADMINISTRADOR`.

| Method | Path | Propósito |
|---|---|---|
| GET | `/api/admin/films` | Lista todos os filmes, incluindo não publicados. Mesmos filtros mais `publicado` |
| GET | `/api/admin/films/{id}` | Qualquer filme, com `videoUrl` |
| POST | `/api/admin/films` | Criar filme |
| PATCH | `/api/admin/films/{id}` | Atualização parcial. Só os campos enviados mudam |
| DELETE | `/api/admin/films/{id}` | Remover filme |

Filmes novos começam não publicados a menos que `publicado` seja true.
`generoIds` substitui a lista inteira de gêneros quando enviado. URLs devem
usar HTTPS.

## Formato de erro

Todo erro devolve `{ message, errors? }`. Erros de validação (400) listam
`field` e `message` por campo inválido. `401` significa token ausente ou
inválido, `403` significa papel não permitido, `404` significa recurso
inexistente e `422` significa que um município ou gênero referenciado não
existe.

## Dados locais

Rodar `yarn db:seed` em `Rolliude-backend/` carrega gêneros, todos os
estados com suas regiões e um conjunto pequeno de municípios. Definir
`SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` também cria ou promove um
administrador.
