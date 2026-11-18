---
name: rolliude-planning-review
description: Revisa e audita um plano de implementação já existente (desta ou de outra sessão) para uma task no Rolliúde Play (Rolliude-front e Rolliude-backend), sempre terminando com um bloco explícito de nomenclatura, arquitetura, banco de dados (Prisma) e Design System pra revisão humana antes de autorizar o código. Use sempre que o usuário chamar /rolliude-planning-review ou pedir pra revisar um plano já existente. Para criar um plano novo do zero, use a skill rolliude-planning em vez desta.
---

## Por que esta skill existe

A implementação em si (código, checks, regras de qualidade) é sempre guiada pela skill `/rolliude-play`, nunca por esta aqui. O propósito desta skill é o que vem **antes** de codar: garantir que decisões estruturais (nomes de rotas, services e componentes, desenho de models e campos no Prisma, contratos Zod entre front e back, uso do Design System) fiquem visíveis em texto simples pro usuário revisar e aprovar, porque corrigir nomenclatura ou modelagem de banco depois que o código já foi escrito custa muito mais caro do que acertar antes. Nunca escreva código nesta skill. O resultado é só o plano revisado.

## Aprovar o ExitPlanMode já dispara a implementação

`/rolliude-planning-review` entrega o plano revisado via `ExitPlanMode`. Quando o usuário aprova ali (inclusive via auto accept), essa aprovação **já é** o sinal pra seguir direto pra implementação. Não pergunte de novo no chat. Assim que o `ExitPlanMode` for aprovado, carregue automaticamente `/rolliude-play` e implemente o plano revisado seguindo as regras dela.

Isso vale tanto pra aprovação direta quanto pra aprovação com pequeno ajuste pedido no aceite (aplique o ajuste e siga). Só não siga pra implementação quando o usuário rejeitar o plano ou pedir uma mudança maior. Nesse caso a skill para ali, e o próximo passo (ajustar o plano ou chamar `/rolliude-planning-review` de novo pra outra rodada) fica a critério do usuário.

## Entrega sempre via plan mode nativo

O plano revisado é sempre apresentado via `EnterPlanMode`/`ExitPlanMode` do Claude Code, nunca como Artifact e nunca só resumido em arquivo. O bloco de arquitetura faz parte do texto que vai pro `ExitPlanMode`.

Se ainda não estiver em plan mode quando a skill for chamada, entre em plan mode primeiro.

---

## Fontes obrigatórias antes de revisar

1. Carregue a skill `/rolliude-play` e leia o `references/` da área afetada (`design-system.md`, `frontend.md`, `backend-database-api.md`, `tooling.md`, `decisions.md`, `workflow.md`).
2. Confira a estrutura real com `ls` antes de aceitar qualquer caminho citado no plano. O front real fica em `Rolliude-front/` e o back em `Rolliude-backend/src/modules/<dominio>/`. Caminho do plano que não existe é gap.
3. Banco: `Rolliude-backend/prisma/schema.prisma` é a única fonte. Contrato HTTP: schemas Zod do módulo (OpenAPI em `GET /api/docs/openapi.json`).

---

## Como revisar o plano

Revise criticamente o plano existente, identificando gaps, inconsistências, ambiguidades, casos extremos e riscos que possam comprometer a execução.

**Analise obrigatoriamente:**
- Variáveis, tipagem, nulabilidade, valores padrão e enums (sem `any`, `as any`, `@ts-ignore`).
- Validações com Zod, regras de negócio e casos extremos.
- Segurança, permissões e exposição de dados (rotas de escrita ainda sem autenticação, decisão 006).
- Tratamento de erros e estados inconsistentes, no padrão do módulo.
- Banco de dados: models, campos, relações, índices, migration Prisma e integridade.
- Contratos de API: schema Zod no back e tipo consumido em `Rolliude-front/src/services/api.ts`.
- Concorrência, duplicidades e condições de corrida, quando aplicável.
- Testes, regressões, cenários críticos e checks do Yarn de `references/workflow.md`.
- Arquitetura, nomenclatura e padrões já adotados no projeto.
- Regras obrigatórias da `/rolliude-play`: sem comentário, sem variável de uma letra, sem `console.log`, sem código morto, sem fonte de verdade duplicada.
- Se envolver UI: só tokens do `@theme`, componentes existentes de `src/components/`, ícones `lucide-react`, títulos em Cinzel, sem `bg-[#hex]` nem `font-['...']`.
- Pendências conhecidas da `/rolliude-play` que caem em arquivo tocado pelo plano.
- Se o plano muda padrão, ferramenta, token ou contrato: se prevê atualizar a skill e `references/decisions.md`.

**Diretrizes:**
1. Consulte o código existente, implementações parecidas, tipos, contratos e regras antes de propor ajustes.
2. Não invente requisitos, funcionalidades ou mudanças de arquitetura. Respeite o escopo original.
3. Para cada gap, descreva o problema, o risco e a correção específica.
4. Especifique tipos, enums, validações, condições, contratos e comportamentos, fundamentando no projeto.
5. Verifique dependências, ordem de execução e consistência entre as etapas.
6. Diferencie fatos de suposições e sinalize o que precisa de confirmação.
7. Evite redundâncias, refatorações e melhorias desnecessárias.
8. Não implemente nada nesta etapa. Apenas revise e aperfeiçoe o plano.

**Resultado esperado:**
1. **Gaps identificados:** problemas encontrados e riscos.
2. **Correções necessárias:** ajustes específicos pra eliminar cada gap.
3. **Plano revisado:** versão completa e consolidada, incorporando as correções sem remover requisitos nem ampliar escopo.
4. **Checklist:** verificações durante e após a implementação (incluindo `yarn lint`, `yarn build` e `yarn prisma:validate` quando tocar o Prisma).
5. **Pendências e riscos residuais:** dúvidas e riscos que ainda dependem de confirmação.

**Critério de qualidade:** plano específico, consistente e verificável, sem decisões implícitas nem suposições evitáveis. Toda correção tem justificativa técnica com respaldo nos requisitos ou no código. Não prometa ausência total de erros; elimine os riscos identificáveis e explicite as incertezas restantes.

Depois desse resultado, inclua o "Bloco obrigatório" abaixo como parte do plano revisado.

---

## Bloco obrigatório: arquitetura pra revisão humana

Este é o objetivo central da skill: o usuário quer revisar a arquitetura, principalmente nomenclatura e desenho de banco, **antes** de autorizar a implementação. O bloco precisa ser simples e direto de ler.

**Antes de aceitar ou propor qualquer nome (rota, função, componente, model, campo), confira contra o que já existe**, rodando uma busca (`Grep`) por nomes parecidos na mesma camada ou domínio.

**A busca precisa deixar rastro, não só a conclusão.** Pra cada nome novo proposto ou já presente no plano auditado, cite o padrão buscado e onde encontrou (ou não), ex.: `createReview` (grep `create[A-Z]` em `Rolliude-backend/src/modules/` → padrão `create<Entidade>` confirmado em `createMovie`, `createProfessional`). Se não achar nada: "grep `<padrão>` em `<pasta>` → nenhum resultado; nome proposto do zero".

Inclua sempre, em texto explícito, esta seção:

```
## 🏗️ Arquitetura pra revisar antes de codar

**Rotas/endpoints:**
- `<método> <caminho>`: <o que faz> (schema Zod: `<nomeDoSchema>`)
(se não houver, escreva "Nenhuma rota nova ou alterada nesta task.")

**Funções, services, componentes:**
- `<nome>` (em `<arquivo>`): <responsabilidade>
(se não houver, escreva "Nenhuma função, service ou componente novo relevante nesta task.")

**Banco de dados (Prisma):**
- Model `<Model>`: campo `<campo>` (`<Tipo>`, <opcional/@default/@unique>), ...
- Relação: `<ModelA>` → `<ModelB>` (<tipo de relação>)
- Migration: `<nome_da_migration>`, <o que ela faz>
(se não houver, escreva "Nenhuma alteração de banco de dados nesta task.")

**Design System (Rolliude-front, quando aplicável):**
- Tokens `@theme` usados: ...
- Componentes reaproveitados de `src/components/`: ...
- Ícones lucide-react: ...
(se não houver UI, escreva "Não aplicável, task não envolve UI.")

**Outras decisões estruturais:**
- Enums, contratos Zod/DTO, dependências novas, atualização da skill ou de `decisions.md`.
(se não houver, escreva "Nenhuma outra decisão estrutural relevante.")

**Branch sugerida:** `feature/<descricao-curta>` a partir da `master`.
```

Nunca omita esta seção nem subseções vazias: explicite que estão vazias.

## Bloco final obrigatório: execução segue /rolliude-play

Todo plano revisado termina com este aviso fixo, logo após o bloco de arquitetura:

```
## ⚙️ Execução

Ao aprovar este plano, a implementação segue automaticamente com a skill `/rolliude-play`: regras obrigatórias de código, Design System, Prisma como fonte única, contrato Zod, checks do Yarn (`yarn lint`, `yarn build`, `yarn prisma:validate` quando tocar o Prisma) e sugestão de branch e commit em Conventional Commits a partir da `master`. Nada de commit ou push sem pedido.
```

Depois desse aviso, aguarde a decisão do `ExitPlanMode`. Se aprovado, carregue `/rolliude-play` e implemente, sem perguntar de novo. Se rejeitado ou com mudança maior, não implemente.
