# Rolliúde Play Agent Instructions

Before changing this repository, read `project-standards/01-authority-map.md`, identify the affected area, then read the matching standard file and accepted ADRs.

Mandatory rules:

- Do not introduce `any`, `as any`, `@ts-ignore` or `@ts-expect-error`.
- Do not leave comments in touched code files.
- Do not use one-letter variables except trivial loop indexes.
- Do not create duplicate sources of truth.
- Do not invent UI colors, fonts, spacing or component variants outside the Design System.
- Keep behavior unchanged during structural moves unless the task explicitly asks for behavior change.
- Run the relevant Yarn checks before marking work complete.
