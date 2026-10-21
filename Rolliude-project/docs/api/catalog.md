# Catalog API Guide

The HTTP contract is generated from the backend Zod schemas and served at `GET /api/docs/openapi.json` (OpenAPI 3.1). That document is canonical. This guide only explains how to use it and does not repeat field definitions.

## Public endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/films` | Paginated list of published films with search and filters |
| GET | `/api/films/{id}` | Published film detail |
| GET | `/api/genres` | Genres for filters and forms |
| GET | `/api/locations/states` | States, optionally filtered by `regiao` |
| GET | `/api/locations/states/{uf}/municipalities` | Municipalities of a state |

### Search and filters

`GET /api/films` accepts, all optional and combinable:

- `busca`: free text. It is accent and case insensitive, split on spaces (up to 5 terms) and every term must match the title or original title.
- `regiao`, `uf`, `municipioId`: location filters.
- `generoId`: films that have the genre.
- `ano`: release year.
- `ordenar`: `recentes` (default), `titulo` or `ano`.
- `pagina` (default 1) and `limite` (default 12, maximum 48).

Responses use `{ data, meta }` where `meta` has `pagina`, `limite`, `total` and `totalPaginas`.

### Video exposure

`videoUrl` is returned to the public only when the film has `dominioPublico` set to true. Otherwise it is `null`. Large media storage and streaming stay governed by ADR-007.

## Administrative endpoints

All routes under `/api/admin/films` require `Authorization: Bearer <token>` from `POST /api/auth/login` and a user whose `papel` is `CURADOR` or `ADMINISTRADOR`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/films` | List all films, including unpublished. Same filters plus `publicado` |
| GET | `/api/admin/films/{id}` | Any film, with `videoUrl` |
| POST | `/api/admin/films` | Create a film |
| PATCH | `/api/admin/films/{id}` | Partial update. Only the fields sent are changed |
| DELETE | `/api/admin/films/{id}` | Remove a film |

New films start unpublished unless `publicado` is true. `generoIds` replaces the whole genre list when sent. URLs must use HTTPS.

## Error shape

Every error returns `{ message, errors? }`. Validation errors (400) list `field` and `message` per invalid field. `401` means missing or invalid token, `403` means the role is not allowed, `404` means the resource does not exist and `422` means a referenced municipality or genre does not exist.

## Local data

Run `yarn db:seed` in `Rolliude-backend/` to load genres, all states with their regions and a small set of municipalities. Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` to also create or promote an administrator.
