# API And Auth Standard

Backend Zod schemas and route metadata are the source for the HTTP contract. Generated OpenAPI is allowed; manual OpenAPI maintained in parallel is not.

Authentication uses email and password for the MVP, JWT bearer tokens, single-use password reset tokens and environment-provided secrets.

Do not add a route without validation and a stable response or error shape.
