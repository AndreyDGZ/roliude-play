# Frontend Standard

Use React, Vite, TypeScript strict mode, CSS Modules and CSS Custom Properties.

Feature-specific code lives under `src/features/<feature>/`. Generic layout remains under `src/components/layout/`; generic primitives live under `src/components/ui/`.

All visual styling must use `src/styles/tokens.css`, `src/styles/typography.css` and `src/styles/globals.css`. Do not hardcode brand colors, spacing or typography in components.

API calls must use `src/lib/http/` as the generic HTTP layer. Feature modules may wrap that layer with feature-specific functions.
