import { z } from 'zod';
import { errorResponseSchema } from '../../shared/errors/error-response.schema';
import { btsIdParamsSchema, btsItemResponseSchema, createBtsItemSchema, listBtsQuerySchema, updateBtsItemSchema } from '../behind-the-scenes/bts.schema';
import {
  createMovieSchema,
  listMoviesQuerySchema,
  movieIdParamsSchema,
  movieResponseSchema,
  paginatedMoviesResponseSchema,
  updateMovieSchema
} from '../movies/movie.schema';
import {
  createProfessionalSchema,
  listProfessionalsQuerySchema,
  paginatedProfessionalsResponseSchema,
  professionalIdParamsSchema,
  professionalResponseSchema,
  updateProfessionalSchema
} from '../professionals/professional.schema';
import { createReviewSchema } from '../reviews/review.schema';

type JsonObject = Record<string, unknown>;
type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

interface Operation {
  method: HttpMethod;
  path: string;
  summary: string;
  tag: string;
  pathParams?: z.ZodObject;
  query?: z.ZodObject;
  body?: z.ZodType;
  successStatus: string;
  successDescription: string;
  successSchema?: z.ZodType;
  errorStatuses: string[];
}

const ERROR_DESCRIPTIONS: Record<string, string> = {
  '400': 'Erro de validação nos campos fornecidos.',
  '404': 'Recurso não encontrado.',
  '422': 'Referência a registro inexistente.'
};

const dataEnvelope = (schema: z.ZodType): z.ZodType => z.object({ data: schema });
const messageEnvelope = (schema: z.ZodType): z.ZodType => z.object({ message: z.string(), data: schema });

const OPERATIONS: Operation[] = [
  {
    method: 'get',
    path: '/movies',
    summary: 'Lista filmes com busca e paginação.',
    tag: 'Filmes',
    query: listMoviesQuerySchema,
    successStatus: '200',
    successDescription: 'Página de filmes.',
    successSchema: paginatedMoviesResponseSchema,
    errorStatuses: ['400']
  },
  {
    method: 'get',
    path: '/movies/{id}',
    summary: 'Detalha um filme.',
    tag: 'Filmes',
    pathParams: movieIdParamsSchema,
    successStatus: '200',
    successDescription: 'Filme encontrado.',
    successSchema: dataEnvelope(movieResponseSchema),
    errorStatuses: ['400', '404']
  },
  {
    method: 'post',
    path: '/movies',
    summary: 'Cadastra um filme.',
    tag: 'Filmes',
    body: createMovieSchema,
    successStatus: '201',
    successDescription: 'Filme cadastrado.',
    successSchema: messageEnvelope(movieResponseSchema),
    errorStatuses: ['400', '422']
  },
  {
    method: 'patch',
    path: '/movies/{id}',
    summary: 'Atualiza parcialmente um filme.',
    tag: 'Filmes',
    pathParams: movieIdParamsSchema,
    body: updateMovieSchema,
    successStatus: '200',
    successDescription: 'Filme atualizado.',
    successSchema: messageEnvelope(movieResponseSchema),
    errorStatuses: ['400', '404', '422']
  },
  {
    method: 'delete',
    path: '/movies/{id}',
    summary: 'Remove um filme.',
    tag: 'Filmes',
    pathParams: movieIdParamsSchema,
    successStatus: '204',
    successDescription: 'Filme removido.',
    errorStatuses: ['400', '404']
  },
  {
    method: 'post',
    path: '/movies/{id}/reviews',
    summary: 'Registra uma avaliação de um filme.',
    tag: 'Avaliações',
    pathParams: movieIdParamsSchema,
    body: createReviewSchema,
    successStatus: '201',
    successDescription: 'Avaliação registrada; retorna o filme com a média recalculada.',
    successSchema: messageEnvelope(movieResponseSchema),
    errorStatuses: ['400', '404']
  },
  {
    method: 'get',
    path: '/professionals',
    summary: 'Lista profissionais do audiovisual.',
    tag: 'Profissionais',
    query: listProfessionalsQuerySchema,
    successStatus: '200',
    successDescription: 'Página de profissionais.',
    successSchema: paginatedProfessionalsResponseSchema,
    errorStatuses: ['400']
  },
  {
    method: 'get',
    path: '/professionals/{id}',
    summary: 'Detalha um profissional.',
    tag: 'Profissionais',
    pathParams: professionalIdParamsSchema,
    successStatus: '200',
    successDescription: 'Profissional encontrado.',
    successSchema: dataEnvelope(professionalResponseSchema),
    errorStatuses: ['400', '404']
  },
  {
    method: 'post',
    path: '/professionals',
    summary: 'Cadastra um profissional.',
    tag: 'Profissionais',
    body: createProfessionalSchema,
    successStatus: '201',
    successDescription: 'Profissional cadastrado.',
    successSchema: messageEnvelope(professionalResponseSchema),
    errorStatuses: ['400', '422']
  },
  {
    method: 'patch',
    path: '/professionals/{id}',
    summary: 'Atualiza parcialmente um profissional.',
    tag: 'Profissionais',
    pathParams: professionalIdParamsSchema,
    body: updateProfessionalSchema,
    successStatus: '200',
    successDescription: 'Profissional atualizado.',
    successSchema: messageEnvelope(professionalResponseSchema),
    errorStatuses: ['400', '404', '422']
  },
  {
    method: 'delete',
    path: '/professionals/{id}',
    summary: 'Remove um profissional.',
    tag: 'Profissionais',
    pathParams: professionalIdParamsSchema,
    successStatus: '204',
    successDescription: 'Profissional removido.',
    errorStatuses: ['400', '404']
  },
  {
    method: 'get',
    path: '/behind-the-scenes',
    summary: 'Lista conteúdos de bastidores, opcionalmente filtrados por filme.',
    tag: 'Bastidores',
    query: listBtsQuerySchema,
    successStatus: '200',
    successDescription: 'Conteúdos de bastidores.',
    successSchema: dataEnvelope(z.array(btsItemResponseSchema)),
    errorStatuses: ['400']
  },
  {
    method: 'get',
    path: '/behind-the-scenes/{id}',
    summary: 'Detalha um conteúdo de bastidores.',
    tag: 'Bastidores',
    pathParams: btsIdParamsSchema,
    successStatus: '200',
    successDescription: 'Conteúdo encontrado.',
    successSchema: dataEnvelope(btsItemResponseSchema),
    errorStatuses: ['400', '404']
  },
  {
    method: 'post',
    path: '/behind-the-scenes',
    summary: 'Cadastra um conteúdo de bastidores.',
    tag: 'Bastidores',
    body: createBtsItemSchema,
    successStatus: '201',
    successDescription: 'Conteúdo cadastrado.',
    successSchema: messageEnvelope(btsItemResponseSchema),
    errorStatuses: ['400', '422']
  },
  {
    method: 'patch',
    path: '/behind-the-scenes/{id}',
    summary: 'Atualiza parcialmente um conteúdo de bastidores.',
    tag: 'Bastidores',
    pathParams: btsIdParamsSchema,
    body: updateBtsItemSchema,
    successStatus: '200',
    successDescription: 'Conteúdo atualizado.',
    successSchema: messageEnvelope(btsItemResponseSchema),
    errorStatuses: ['400', '404', '422']
  },
  {
    method: 'delete',
    path: '/behind-the-scenes/{id}',
    summary: 'Remove um conteúdo de bastidores.',
    tag: 'Bastidores',
    pathParams: btsIdParamsSchema,
    successStatus: '204',
    successDescription: 'Conteúdo removido.',
    errorStatuses: ['400', '404']
  }
];

function toJsonSchema(schema: z.ZodType, io: 'input' | 'output'): JsonObject {
  const jsonSchema: JsonObject = z.toJSONSchema(schema, { io });

  return Object.fromEntries(Object.entries(jsonSchema).filter(([key]) => key !== '$schema'));
}

function toParameters(schema: z.ZodObject, location: 'query' | 'path'): JsonObject[] {
  const jsonSchema = toJsonSchema(schema, 'input');
  const properties = (jsonSchema.properties ?? {}) as Record<string, JsonObject>;
  const required = new Set((jsonSchema.required ?? []) as string[]);

  return Object.entries(properties).map(([name, propertySchema]) => ({
    name,
    in: location,
    required: location === 'path' || required.has(name),
    schema: propertySchema
  }));
}

function toOperationObject(operation: Operation): JsonObject {
  const parameters = [
    ...(operation.pathParams ? toParameters(operation.pathParams, 'path') : []),
    ...(operation.query ? toParameters(operation.query, 'query') : [])
  ];

  const successContent = operation.successSchema
    ? { content: { 'application/json': { schema: toJsonSchema(operation.successSchema, 'output') } } }
    : {};

  const errorResponses = Object.fromEntries(
    operation.errorStatuses.map(status => [
      status,
      {
        description: ERROR_DESCRIPTIONS[status],
        content: { 'application/json': { schema: toJsonSchema(errorResponseSchema, 'output') } }
      }
    ])
  );

  return {
    summary: operation.summary,
    tags: [operation.tag],
    ...(parameters.length > 0 ? { parameters } : {}),
    ...(operation.body
      ? {
          requestBody: {
            required: true,
            content: { 'application/json': { schema: toJsonSchema(operation.body, 'input') } }
          }
        }
      : {}),
    responses: {
      [operation.successStatus]: { description: operation.successDescription, ...successContent },
      ...errorResponses
    }
  };
}

export function buildOpenApiDocument(): JsonObject {
  const paths: Record<string, JsonObject> = {};

  for (const operation of OPERATIONS) {
    paths[operation.path] = { ...paths[operation.path], [operation.method]: toOperationObject(operation) };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'Rolliúde Play API',
      version: '1.0.0',
      description: 'Contrato gerado a partir dos schemas Zod do backend. API totalmente pública, sem autenticação.'
    },
    servers: [{ url: '/api' }],
    paths
  };
}
