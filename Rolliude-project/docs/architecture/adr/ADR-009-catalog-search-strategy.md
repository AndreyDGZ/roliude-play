# ADR-009 Catalog Search Strategy

Status: Accepted

Context

Sprint 4 needs text search over film titles that ignores case and accents, because Brazilian Portuguese users type "joao" for "João". Prisma `contains` with insensitive mode is case insensitive but not accent insensitive, and it cannot use an index for unaccented matching.

Decision

Keep a derived column `filmes.titulo_busca` holding the lowercase, accent-free text of the title and original title. The application recomputes it whenever `titulo` or `titulo_original` is written. The migration backfills existing rows with the same normalization.

Index the column with a GIN trigram index (`pg_trgm`, `gin_trgm_ops`) so substring searches use the index. The search term is normalized the same way, split on whitespace (up to 5 terms) and every term must match.

Add a composite index on `publicado` and `createdAt` descending for the default listing order, replacing the single column `publicado` index.

Alternatives considered

The `unaccent` extension with an immutable wrapper function. Rejected because it needs raw SQL outside Prisma queries and an extra extension.

Prisma `contains` with insensitive mode on `titulo`. Rejected because it does not ignore accents.

An external search engine. Rejected as disproportionate for the MVP catalog size.

Consequences

`titulo_busca` is a derived value and must never be written from request input. Code that writes film titles must go through `FilmService`.

The database user running migrations must be allowed to create the `pg_trgm` extension, which PostgreSQL marks as trusted from version 13.

Searching by professionals, required by the MVP, needs its own change when people are modeled.

Date

2026-10-14
