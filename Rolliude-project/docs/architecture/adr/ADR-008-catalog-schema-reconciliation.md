# ADR-008 Catalog Schema Reconciliation

Status: Accepted

Context

ADR-004 blocks catalog features until the Prisma baseline is reconciled with the Sprint 1 database report. The baseline only had a minimal `Filme` table with no relation to locations or genres. Sprint 3 delivers the catalog, which needs film metadata, genres, municipality, region filtering and an administrative role.

Decision

Reconcile only the entities the MVP catalog needs, taken from the Sprint 1 report (`docs/schema-filmes-test.txt`):

- `Filme` gains `titulo_original`, `sinopse`, `ano_lancamento`, `duracao_min`, `classificacao_indicativa`, `idioma_original`, `poster_url`, `trailer_url`, `publicado` and `municipio_id`.
- `FilmeGenero` is the many-to-many table between films and genres.
- `Estado` gains the `regiao` enum so region filtering does not depend on a separate table.
- `Usuario` gains the `papel` enum (`USUARIO`, `CURADOR`, `ADMINISTRADOR`) to protect administrative routes.
- `Municipio` gets a unique constraint on state and name so reference data can be seeded idempotently.

Directors, actors, cast, ratings, favorites and viewing history from the Sprint 1 report stay out until their sprints implement them.

The migration backfills `estados.regiao` from the UF before setting it to `NOT NULL`, so databases that already hold states migrate safely.

Alternatives considered

Converting the whole Sprint 1 schema at once. Rejected because `05-database.md` treats entities beyond the MVP as roadmap until implemented in code.

A separate `Regiao` table. Rejected because the five regions are fixed and an enum keeps queries and seeds simpler.

Consequences

Catalog work may proceed. Future sprints that add people, ratings or favorites must add their own migrations and update `05-database.md`.

Film videos are only exposed publicly when `dominio_publico` is true. Large media storage and streaming remain governed by ADR-007.

Date

2026-10-14
