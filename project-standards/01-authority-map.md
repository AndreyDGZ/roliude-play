# Authority Map

| Subject | Canonical source | Not canonical |
|---|---|---|
| Product vision | `docs/product/vision.md` | README, chat messages |
| Current MVP | `docs/product/mvp.md` | historical sprint documents |
| Requirements | `docs/product/requirements.md` | informal implementation notes |
| Architecture decisions | accepted ADRs in `docs/architecture/adr/` | chat messages |
| Database | `backend/prisma/schema.prisma` and `backend/prisma/migrations/` after reconciliation | loose SQL or historical sprint documents |
| HTTP contract | backend route schemas and generated OpenAPI | manual frontend types that diverge |
| UI tokens | `frontend/src/styles/tokens.css` | copied values inside components |
| UI components | `frontend/src/components/ui/` | duplicated page-local implementations |
| Runtime | `.nvmrc`, `package.json` engines, Docker and CI | README-only values |
| Dependencies | `package.json` and official `yarn.lock` files | copied dependency lists |
| Git flow | `CONTRIBUTING.md` | group chat messages |
| Agent instructions | `AGENTS.md` and `project-standards/` | independent AI rule copies |

When sources diverge, stop the affected implementation, identify the canonical source, document structural decisions in an ADR, correct the non-canonical source, then continue.
