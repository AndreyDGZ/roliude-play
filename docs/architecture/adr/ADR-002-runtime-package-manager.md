# ADR-002 Runtime And Package Manager

Status: Accepted

Context

The repository had npm and Yarn lockfiles.

Decision

Use Node `>=20` and Yarn `1.22.22` for frontend and backend.

Alternatives considered

npm with `package-lock.json`.

Consequences

CI, Docker, README and local commands use Yarn. npm lockfiles are not maintained.

Date

2026-09-21
