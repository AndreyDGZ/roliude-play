# Padrões do projeto (project-standards)

Consolidação dos 9 arquivos de padrão por tema. Cada um era um arquivo
próprio; aqui viram seções do mesmo documento de referência.

## 1. Mapa de autoridade
Ver `SKILL.md` (seção "Mapa de autoridade") pra versão resumida em uso.
Regra geral: quando duas fontes divergem sobre o mesmo assunto, pare a
implementação afetada, identifique a fonte canônica, documente a decisão
estrutural em uma ADR se for arquitetural, corrija a fonte não canônica, e
só então continue.

## 2. Limites de arquitetura
Manter o repositório dividido em `Rolliude-front/`, `Rolliude-backend/` e a
documentação da skill (antes `Rolliude-project/`, hoje
`.claude/skills/rolliude-play/`).

Código de negócio do backend vai em módulos. Código compartilhado do backend
se limita a infraestrutura transversal (erros, middlewares, logger,
utilitários HTTP e helpers genéricos). Código compartilhado não pode
depender de módulo de negócio.

Páginas, serviços, hooks e tipos específicos de uma feature do frontend
ficam perto da feature. Infraestrutura HTTP genérica vai em
`src/lib/http/`. UI genérica vai em `src/components/ui/`.

Não criar módulos de roadmap vazios. Criar só os domínios que estão
implementados agora.

## 3. Frontend
Usar React, Vite, TypeScript strict mode, CSS Modules e CSS Custom
Properties.

Código específico de feature vive em `src/features/<feature>/`. Layout
genérico fica em `src/components/layout/`; primitivas genéricas vivem em
`src/components/ui/`.

Toda estilização visual deve usar `src/styles/tokens.css`,
`src/styles/typography.css` e `src/styles/globals.css`. Não hardcodear cor
de marca, espaçamento ou tipografia em componentes.

Chamadas de API devem usar `src/lib/http/` como camada HTTP genérica.
Módulos de feature podem envolver essa camada com funções específicas.

## 4. Backend
Usar Express, TypeScript strict mode, Prisma e Zod.

Setup da aplicação vai em `src/app/app.ts`; inicialização do processo vai em
`src/app/server.ts`.

Configuração vai em `src/config/`. Variáveis de ambiente devem ser
validadas antes do servidor iniciar.

Erros devem usar o handler central de erro e um formato estável de resposta
de erro.

Não devolver entidades cruas do Prisma contendo campos sensíveis.

## 5. Banco de dados
O schema e as migrations do Prisma são canônicos depois que a reconciliação
de schema do Sprint 1 estiver completa (ver ADR-008).

Antes de migrations novas, comparar o schema do Prisma atual com o relatório
de banco do Sprint 1, registrar a estratégia de baseline numa ADR e validar
migrations contra um PostgreSQL descartável.

Entidades do MVP são usuários (com papel), tokens de redefinição de senha,
estados (com região), municípios, gêneros, filmes e a relação
filme-gênero, conforme reconciliado na ADR-008. Entidades do Sprint 1 além
dessas ficam como roadmap até serem implementadas em código.

`filmes.titulo_busca` é uma coluna de busca derivada definida na ADR-009 e
não deve ser escrita a partir de input de requisição.

## 6. API e autenticação
Os schemas Zod e os metadados de rota do backend são a fonte do contrato
HTTP. OpenAPI gerado é permitido; OpenAPI mantido manualmente em paralelo
não é.

Autenticação usa e-mail e senha pro MVP, tokens JWT bearer, tokens de
redefinição de senha de uso único e segredos vindos de variável de
ambiente.

Não adicionar rota sem validação e sem um formato estável de resposta ou
erro.

## 7. UI e acessibilidade
Nome de marca oficial é Rolliúde Play.

Paleta oficial:

| Token | Valor |
|---|---|
| Camurça | `#F9F5EB` |
| Tinta | `#241A10` |
| Laranja | `#FF9200` |
| Terracota | `#C84B31` |
| Amarelo | `#FFD23F` |

Usar token semântico em vez de cor crua nos componentes. Controles
interativos precisam de estado de foco visível, acesso via teclado e
contraste suficiente.

## 8. Qualidade e segurança
Regras obrigatórias:
- sem `any`, `as any`, `@ts-ignore` ou `@ts-expect-error`;
- sem comentário em arquivo de código tocado;
- sem variável de uma letra, exceto índice trivial de loop;
- sem import não usado, variável não usada, código morto ou `console.log`;
- sem segredo em código-fonte;
- sem valor sensível em log;
- input externo deve ser validado;
- UI deve usar tokens do Design System.

## 9. Git e documentação
Usar Conventional Commits e pull requests focados.

Branches partem de `develop`. Usar `feature/`, `fix/`, `refactor/`,
`docs/`, `test/` ou `chore/`.

Atualizar a documentação canônica na mesma pull request da mudança
estrutural relacionada.

Documentos históricos devem ser marcados como históricos antes de serem
usados como material de referência.

Ver `references/git-workflow.md` pro fluxo completo de contribuição
(checks obrigatórios de PR).
