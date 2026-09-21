# Backend Standard

Use Express, TypeScript strict mode, Prisma and Zod.

Application setup belongs in `src/app/app.ts`; process startup belongs in `src/app/server.ts`.

Configuration belongs in `src/config/`. Environment variables must be validated before the server starts.

Errors must use the central error handler and a stable error response shape.

Do not return raw Prisma entities containing sensitive fields.
