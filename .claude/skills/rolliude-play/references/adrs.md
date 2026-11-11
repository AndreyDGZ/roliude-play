# ADRs aceitas (Rolliude Play)

Decisões arquiteturais aceitas do projeto, condensadas. Todas com
`Status: Accepted`. Quando uma decisão aqui divergir do código real, pare,
identifique a fonte canônica e documente a reconciliação (nova ADR ou
correção do código), nunca decida sozinho qual lado vale.

## ADR-001 Brand Naming
Nome de exibição oficial é Rolliúde Play. O slug técnico é `rolliude-play`.

## ADR-002 Runtime And Package Manager
Node `>=20` e Yarn `1.22.22` no frontend e no backend.

## ADR-003 Styling Strategy
CSS Modules com CSS Custom Properties. Tokens de marca globais vivem em
`Rolliude-front/src/styles/`. Não é Tailwind.

## ADR-004 Database Baseline
Tratar o `schema.prisma` e as migrations atuais como baseline executável até
uma PR de reconciliação dedicada expandir com as entidades do Sprint 1.

## ADR-005 API Contract Strategy
Usar os schemas do backend e os metadados de rota como fonte pro OpenAPI
gerado e pros tipos de API do frontend. Não há convenção de nome de caminho
de rota imposta por esta ADR além de "vem do backend" — ver
`references/api-catalog.md` pro contrato documentado hoje.

## ADR-006 Authentication Strategy
E-mail e senha, hash de senha com bcrypt, tokens JWT bearer e tokens de
redefinição de senha de uso único.

## ADR-007 Media Storage And Streaming
O MVP pode armazenar URLs de mídia, mas upload de mídia grande, autorização e
streaming exigem uma decisão de storage dedicada futura antes de implementar.

## ADR-008 Catalog Schema Reconciliation
Reconcilia só as entidades que o catálogo do MVP precisa, tiradas do
relatório do Sprint 1 (`references/schema-filmes-test.md`):
- `Filme` ganha `titulo_original`, `sinopse`, `ano_lancamento`,
  `duracao_min`, `classificacao_indicativa`, `idioma_original`,
  `poster_url`, `trailer_url`, `publicado` e `municipio_id`.
- `FilmeGenero` é a tabela N:N entre filmes e gêneros.
- `Estado` ganha o enum `regiao` pra filtro de região não depender de tabela
  separada.
- `Usuario` ganha o enum `papel` (`USUARIO`, `CURADOR`, `ADMINISTRADOR`) pra
  proteger rotas administrativas.
- `Municipio` ganha unique constraint em estado+nome pra permitir seed
  idempotente.

Diretores, elenco, avaliações, favoritos e histórico de visualização do
relatório do Sprint 1 ficam fora até suas sprints os implementarem.

## ADR-009 Catalog Search Strategy
Manter uma coluna derivada `filmes.titulo_busca` com o texto em minúsculas e
sem acento do título e do título original. A aplicação recalcula sempre que
`titulo` ou `titulo_original` é escrito. A migration faz backfill das linhas
existentes com a mesma normalização.
