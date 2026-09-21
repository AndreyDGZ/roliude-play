# Authority Map

| Subject | Canonical source | Not canonical |
|---|---|---|
| Product vision | `Rolliude-project/docs/product/vision.md` | README, chat messages |
| Current MVP | `Rolliude-project/docs/product/mvp.md` | historical sprint documents |
| Requirements | `Rolliude-project/docs/product/requirements.md` | informal implementation notes |
| Architecture decisions | accepted ADRs in `Rolliude-project/docs/architecture/adr/` | chat messages |
| Database | `Rolliude-backend/prisma/schema.prisma` and `Rolliude-backend/prisma/migrations/` after reconciliation | loose SQL or historical sprint documents |
| HTTP contract | backend route schemas and generated OpenAPI | manual frontend types that diverge |
| UI tokens | `Rolliude-front/src/styles/tokens.css` | copied values inside components |
| UI components | `Rolliude-front/src/components/ui/` | duplicated page-local implementations |
| Runtime | `.nvmrc`, `package.json` engines, Docker and CI | README-only values |
| Dependencies | `package.json` and official `yarn.lock` files | copied dependency lists |
| Git flow | `Rolliude-project/CONTRIBUTING.md` | group chat messages |
| Agent instructions | `AGENTS.md` and `Rolliude-project/project-standards/` | independent AI rule copies |

When sources diverge, stop the affected implementation, identify the canonical source, document structural decisions in an ADR, correct the non-canonical source, then continue.
