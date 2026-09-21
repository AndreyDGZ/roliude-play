# ADR-005 API Contract Strategy

Status: Accepted

Context

Manual contracts can diverge from backend validation.

Decision

Use backend schemas and route metadata as the source for generated OpenAPI and frontend API types.

Alternatives considered

Manual OpenAPI as a separate source.

Consequences

Do not edit generated API types manually.

Date

2026-09-21
