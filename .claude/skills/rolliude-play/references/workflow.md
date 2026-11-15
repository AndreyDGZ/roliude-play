# Fluxo de trabalho

## Git

- Branch a partir da `develop`: `feature/`, `fix/`, `refactor/`, `docs/`, `test/` ou `chore/` + descrição curta.
- Commits em Conventional Commits (`feat(front): ...`, `fix(backend): ...`).
- Um PR, um objetivo. Se a mudança altera regra, ferramenta, token ou contrato, a skill é atualizada no mesmo PR.
- PR aponta para `develop`; `main` recebe as releases.

## Checks antes de dar como pronto

Front:
```bash
yarn install --frozen-lockfile
yarn lint
yarn build
```

Back:
```bash
yarn install --frozen-lockfile
yarn lint
yarn build
yarn prisma:validate   # quando tocar o Prisma
```

## Sprints e ClickUp

- 12 sprints (0 a 11), entrega semanal às quartas, Scrum/Kanban híbrido, prioridades urgent, high, normal, low.
- Tasks no ClickUp; a integração tem limite de 100 chamadas por dia.
- Relatório de sprint para o WhatsApp sai em PDF, com template editorial verde e creme. Essa paleta é só da comunicação do time, não do produto.
