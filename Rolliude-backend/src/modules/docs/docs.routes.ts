import { Request, Response, Router } from 'express';
import { buildOpenApiDocument } from './openapi';

const docsRoutes = Router();
const openApiDocument = buildOpenApiDocument();

docsRoutes.get('/openapi.json', (_request: Request, response: Response) => {
  response.json(openApiDocument);
});

export { docsRoutes };
