# ADR-003 Styling Strategy

Status: Accepted

Context

The UI needed one styling strategy aligned with the Rolliúde Play Design System.

Decision

Use CSS Modules with CSS Custom Properties. Global brand tokens live in `Rolliude-front/src/styles/`.

Alternatives considered

Tailwind and inline styles.

Consequences

Components must consume semantic tokens. New inline visual styles are not allowed.

Date

2026-09-21
