# Database Standard

Prisma schema and migrations are canonical after the Sprint 1 schema reconciliation is complete.

Before new migrations, compare the current Prisma schema with the Sprint 1 database report, record the baseline strategy in an ADR and validate migrations against a disposable PostgreSQL database.

MVP entities are users (with role), password reset tokens, states (with region), municipalities, genres, movies and the movie-genre relation, as reconciled in ADR-008. Sprint 1 entities beyond that are roadmap until implemented in code.

`filmes.titulo_busca` is a derived search column defined in ADR-009 and must not be written from request input.
