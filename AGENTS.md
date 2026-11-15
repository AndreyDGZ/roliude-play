# Rolliúde Play Agent Instructions

The single source of rules and documentation is the skill `.claude/skills/rolliude-play/SKILL.md` and its `references/` folder. Read it before changing this repository and follow the reference file for the affected area.

Mandatory rules:

- Do not introduce `any`, `as any`, `@ts-ignore` or `@ts-expect-error`.
- Do not leave comments in touched code files.
- Do not use one-letter variables except trivial loop indexes.
- Do not create duplicate sources of truth.
- Do not invent UI colors, fonts, spacing or component variants outside the Design System in `references/design-system.md`.
- Keep behavior unchanged during structural moves unless the task explicitly asks for behavior change.
- Run the relevant Yarn checks before marking work complete.
- Update the skill in the same pull request when a rule, tool, token or contract changes.
