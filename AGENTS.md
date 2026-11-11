# Rolliúde Play Agent Instructions

Before changing this repository, read the `rolliude-play` skill at `.claude/skills/rolliude-play/SKILL.md`, identify the affected area from its authority map, then read the matching section in `references/standards.md` and the accepted ADRs in `references/adrs.md`.

Mandatory rules:

- Do not introduce `any`, `as any`, `@ts-ignore` or `@ts-expect-error`.
- Do not leave comments in touched code files.
- Do not use one-letter variables except trivial loop indexes.
- Do not create duplicate sources of truth.
- Do not invent UI colors, fonts, spacing or component variants outside the Design System.
- Keep behavior unchanged during structural moves unless the task explicitly asks for behavior change.
- Run the relevant Yarn checks before marking work complete.
