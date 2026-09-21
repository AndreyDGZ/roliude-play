# ADR-004 Database Baseline

Status: Accepted

Context

The current Prisma schema is smaller than the Sprint 1 database report.

Decision

Treat the current Prisma schema and migrations as the executable baseline until a dedicated reconciliation PR expands it with Sprint 1 entities.

Alternatives considered

Immediate full conversion of all Sprint 1 tables.

Consequences

No new database-dependent catalog feature should proceed before reconciliation.

Date

2026-09-21
