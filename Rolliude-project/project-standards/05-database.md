# Database Standard

Prisma schema and migrations are canonical after the Sprint 1 schema reconciliation is complete.

Before new migrations, compare the current Prisma schema with the Sprint 1 database report, record the baseline strategy in an ADR and validate migrations against a disposable PostgreSQL database.

MVP entities are users, password reset tokens, states, municipalities, genres and movies. Sprint 1 entities beyond that are roadmap until implemented in code.
