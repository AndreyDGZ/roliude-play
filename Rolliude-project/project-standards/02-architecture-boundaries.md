# Architecture Boundaries

Keep the repository split into `Rolliude-front/`, `Rolliude-backend/` and `Rolliude-project/`.

Backend business code belongs in modules. Shared backend code is limited to cross-cutting infrastructure such as errors, middlewares, logger, HTTP utilities and generic helpers. Shared code must not depend on business modules.

Frontend feature-specific pages, services, hooks and types belong near the feature. Generic HTTP infrastructure belongs in `src/lib/http/`. Generic UI belongs in `src/components/ui/`.

Do not create empty roadmap modules. Create only domains that are implemented now.
