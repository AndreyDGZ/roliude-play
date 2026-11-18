---
name: rolliude-planning
description: Cria do zero um plano de implementação para uma task nova no Rolliúde Play (Rolliude-front e Rolliude-backend), sempre terminando com um bloco explícito de nomenclatura, arquitetura, banco de dados (Prisma) e Design System pra revisão humana antes de autorizar o código. Use sempre que o usuário chamar /rolliude-planning, pedir pra planejar uma task nova, ou entrar em plan mode pra uma task deste projeto. Para revisar ou auditar um plano já existente, use a skill rolliude-planning-review em vez desta.
---

## Por que esta skill existe

A implementação em si (código, checks, regras de qualidade) é sempre guiada pela skill `/rolliude-play`, nunca por esta aqui. O propósito desta skill é o que vem **antes** de codar: garantir que decisões estruturais (nomes de rotas, services e componentes, desenho de models e campos no Prisma, contratos Zod entre front e back, uso do Design System) fiquem visíveis em texto simples pro usuário revisar e aprovar, porque corrigir nomenclatura ou modelagem de banco depois que o código já foi escrito custa muito mais caro do que acertar antes. Nunca escreva código nesta skill. O resultado é só o plano.

## Aprovar o ExitPlanMode já dispara a implementação

`/rolliude-planning` entrega o plano via `ExitPlanMode`. Quando o usuário aprova ali (inclusive via auto accept), essa aprovação **já é** o sinal pra seguir direto pra implementação. Não pergunte de novo no chat algo como "plano aprovado, posso seguir?". Assim que o `ExitPlanMode` for aprovado, carregue automaticamente `/rolliude-play` e implemente o plano aprovado seguindo as regras dela.

Isso vale tanto pra aprovação direta quanto pra aprovação com pequeno ajuste pedido no aceite (nesse caso, aplique o ajuste e siga do mesmo jeito). Só não siga pra implementação quando o usuário rejeitar o plano ou pedir uma mudança maior. Nesse caso a skill para ali, e o próximo passo (ajustar o plano ou chamar `/rolliude-planning-review`) fica a critério do usuário.

## Entrega sempre via plan mode nativo

O plano final é sempre apresentado via `EnterPlanMode`/`ExitPlanMode` do Claude Code, nunca como Artifact e nunca só resumido em arquivo. O bloco de arquitetura descrito abaixo faz parte do texto do plano que vai pro `ExitPlanMode`: é texto que o usuário lê e aprova ali mesmo, não um anexo.

Se ainda não estiver em plan mode quando a skill for chamada, entre em plan mode primeiro.

---

## Fontes obrigatórias antes de planejar

1. Carregue a skill `/rolliude-play` e leia o `references/` da área afetada (`design-system.md`, `frontend.md`, `backend-database-api.md`, `tooling.md`, `decisions.md`, `workflow.md`).
2. Confira a estrutura real com `ls` antes de citar caminhos. O front real fica em `Rolliude-front/` e o back em `Rolliude-backend/src/modules/<dominio>/`. Se a documentação citar uma pasta que não existe, siga a estrutura real e registre a divergência em "Pendências" do plano.
3. Banco: `Rolliude-backend/prisma/schema.prisma` é a única fonte. Contrato HTTP: schemas Zod do módulo (OpenAPI gerado em `GET /api/docs/openapi.json`).

---

## Como construir o plano

1. **Leia o código real antes de desenhar qualquer coisa nova.** Procure implementações parecidas: módulos do back (routes, schemas Zod, services), models do `schema.prisma`, componentes em `Rolliude-front/src/components/`, chamadas em `src/services/api.ts`, abas no `App.tsx`. Nomenclatura, estrutura de pastas e padrão de erro seguem exatamente o que já existe, nunca um estilo novo.
2. **Não invente requisito nem amplie escopo.** O plano cobre exatamente o que o usuário pediu.
3. **Antes das dimensões, liste explicitamente as camadas afetadas** (ex.: "`Rolliude-backend`: módulo `movies` (schema Zod + service + rota) + migration. `Rolliude-front`: componente X + função em `api.ts`."). Essa lista decide quais dimensões entram no plano.
4. Pra cada dimensão abaixo, diga em uma frase curta se ela entra e por quê (ex.: "Banco de dados: não entra, task não cria nem altera model."):
   - Tipagem, nulabilidade, valores padrão, enums (sem `any`, `as any`, `@ts-ignore`).
   - Validações e regras de negócio, incluindo casos extremos. Toda entrada externa validada com Zod.
   - Segurança, permissões, exposição de dados (lembrar que rotas de escrita ainda não têm autenticação, decisão 006).
   - Tratamento de erro e estados inconsistentes, seguindo o padrão do módulo.
   - Banco de dados: models, campos, relações, índices, migration Prisma.
   - Contratos de API e comunicação front/back (schema Zod, tipo consumido em `api.ts`).
   - Concorrência, duplicidade, condição de corrida, quando aplicável.
   - Testes e cenários críticos a cobrir (só identificar, nunca rodar), mais os checks do Yarn de `references/workflow.md`.
   - Nomenclatura e arquitetura, seguindo o padrão real do projeto.
   - **Regras obrigatórias do projeto:** apontar onde há risco de `any`, comentário, variável de uma letra, `console.log`, código morto ou fonte de verdade duplicada.
   - **Se envolver UI:** quais tokens do `@theme` e quais componentes existentes de `src/components/` serão reaproveitados, ícones só `lucide-react`, títulos em Cinzel, sem `bg-[#hex]` nem `font-['...']`.
   - **Pendências conhecidas:** se a task tocar arquivo listado nas pendências da `/rolliude-play` (ex.: `CatalogView.tsx` com `any`, hex avulsos), dizer o que será corrigido por ser arquivo tocado, sem ampliar escopo além disso.
5. Monte o plano em etapas ordenadas, deixando clara a dependência entre elas (normalmente: Prisma e migration, depois schema Zod e service, depois rota, depois `api.ts`, depois UI).
6. Se o plano mudar padrão, ferramenta, token ou contrato, inclua etapa de atualizar a skill `/rolliude-play` e registrar em `references/decisions.md` quando for decisão estrutural.
7. Termine com o "Bloco obrigatório" e o "Bloco final" abaixo.

---

## Bloco obrigatório: arquitetura pra revisão humana

Este é o objetivo central da skill: o usuário quer revisar a arquitetura, principalmente nomenclatura e desenho de banco, **antes** de autorizar a implementação. O bloco precisa ser simples e direto de ler, não um despejo técnico.

**Antes de propor qualquer nome novo (rota, função, componente, model, campo), confira contra o que já existe**, rodando uma busca (`Grep`) por nomes parecidos na mesma camada ou domínio. Isso evita propor `getMovieData` num módulo que já usa `getMovieById`, ou um campo `createdDate` num schema onde todos os models usam `createdAt`.

**A busca precisa deixar rastro, não só a conclusão.** Pra cada nome novo, cite o padrão buscado e onde encontrou (ou não), ex.: `createReview` (grep `create[A-Z]` em `Rolliude-backend/src/modules/` → padrão `create<Entidade>` confirmado em `createMovie`, `createProfessional`). Se não achar nada, diga: "grep `<padrão>` em `<pasta>` → nenhum resultado; nome proposto do zero".

Inclua sempre, em texto explícito (nunca resumido como "ajustes no banco"), esta seção:

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

Nunca omita esta seção nem subseções vazias: explicite que estão vazias. É melhor o usuário ver "nenhuma alteração de banco" do que ficar sem saber se ela foi esquecida.

## Bloco final obrigatório: execução segue /rolliude-play

Todo plano termina com este aviso fixo, logo após o bloco de arquitetura:

```
## ⚙️ Execução

Ao aprovar este plano, a implementação segue automaticamente com a skill `/rolliude-play`: regras obrigatórias de código, Design System, Prisma como fonte única, contrato Zod, checks do Yarn (`yarn lint`, `yarn build`, `yarn prisma:validate` quando tocar o Prisma) e sugestão de branch e commit em Conventional Commits a partir da `master`. Nada de commit ou push sem pedido.
```

Depois desse aviso, aguarde a decisão do `ExitPlanMode`. Se aprovado, carregue `/rolliude-play` e implemente, sem perguntar de novo. Se rejeitado ou com mudança maior, não implemente.
