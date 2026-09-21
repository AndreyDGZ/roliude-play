# Contributing

Use Yarn `1.22.22` and Node `>=20`.

Work from `develop` into focused branches named `feature/<description>`, `fix/<description>`, `refactor/<description>`, `docs/<description>`, `test/<description>` or `chore/<description>`.

Every pull request must have one main purpose, update the canonical documentation when behavior or contracts change, and pass the relevant checks:

```bash
yarn install --frozen-lockfile
yarn format:check
yarn typecheck
yarn build
```

Backend changes that touch Prisma must also pass:

```bash
yarn prisma:validate
```

Code quality is mandatory: no `any`, no comments in touched code files, no unused code, clear names and Design System compliance for UI.
