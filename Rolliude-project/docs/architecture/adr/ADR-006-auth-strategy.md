# ADR-006 Authentication Strategy

Status: Accepted

Context

The MVP needs email/password authentication and password recovery.

Decision

Use email and password, bcrypt password hashing, JWT bearer tokens and single-use password reset tokens.

Alternatives considered

Session cookies and social login for MVP.

Consequences

JWT secrets must come from environment variables. Password reset tokens expire and become single-use.

Date

2026-09-21
