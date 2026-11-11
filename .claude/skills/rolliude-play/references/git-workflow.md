# Fluxo de Git e contribuição

Usar Yarn `1.22.22` e Node `>=20`.

Trabalhar a partir de `develop` em branches focadas, nomeadas
`feature/<descrição>`, `fix/<descrição>`, `refactor/<descrição>`,
`docs/<descrição>`, `test/<descrição>` ou `chore/<descrição>`.

Toda pull request deve ter um propósito principal só, atualizar a
documentação canônica quando comportamento ou contrato mudar, e passar nos
checks relevantes:

```bash
yarn install --frozen-lockfile
yarn format:check
yarn typecheck
yarn build
```

Mudanças de backend que tocam Prisma também precisam passar:

```bash
yarn prisma:validate
```

Qualidade de código é obrigatória: sem `any`, sem comentário em código
tocado, sem código morto, nomes claros e conformidade com o Design System
na UI.
