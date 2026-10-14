import { z } from 'zod';
import { errorResponseSchema } from '../../shared/errors/error-response.schema';
import {
  createFilmSchema,
  filmIdParamsSchema,
  filmResponseSchema,
  listAdminFilmsQuerySchema,
  listFilmsQuerySchema,
  paginatedFilmsResponseSchema,
  updateFilmSchema
} from '../films/film.schema';
import { genreResponseSchema } from '../genres/genre.schema';
import {
  listStatesQuerySchema,
  municipalityResponseSchema,
  stateParamsSchema,
  stateResponseSchema
} from '../locations/location.schema';

type JsonObject = Record<string, unknown>;
type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

interface Operation {
  method: HttpMethod;
  path: string;
  summary: string;
  tag: string;
  secured: boolean;
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
  '401': 'Autenticação necessária ou token inválido.',
  '403': 'Papel sem permissão para a ação.',
  '404': 'Recurso não encontrado.',
  '422': 'Referência a registro inexistente.'
};

const dataEnvelope = (schema: z.ZodType): z.ZodType => z.object({ data: schema });
const messageEnvelope = (schema: z.ZodType): z.ZodType => z.object({ message: z.string(), data: schema });

const OPERATIONS: Operation[] = [
  {
    method: 'get',
    path: '/films',
    summary: 'Lista filmes publicados com busca, filtros e paginação.',
    tag: 'Catálogo',
    secured: false,
    query: listFilmsQuerySchema,
    successStatus: '200',
    successDescription: 'Página de filmes publicados.',
    successSchema: paginatedFilmsResponseSchema,
    errorStatuses: ['400']
  },
  {
    method: 'get',
    path: '/films/{id}',
    summary: 'Detalha um filme publicado.',
    tag: 'Catálogo',
    secured: false,
    pathParams: filmIdParamsSchema,
    successStatus: '200',
    successDescription: 'Filme encontrado.',
    successSchema: dataEnvelope(filmResponseSchema),
    errorStatuses: ['400', '404']
  },
  {
    method: 'get',
    path: '/genres',
    summary: 'Lista os gêneros disponíveis.',
    tag: 'Referências',
    secured: false,
    successStatus: '200',
    successDescription: 'Gêneros em ordem alfabética.',
    successSchema: dataEnvelope(z.array(genreResponseSchema)),
    errorStatuses: []
  },
  {
    method: 'get',
    path: '/locations/states',
    summary: 'Lista estados, opcionalmente por região.',
    tag: 'Referências',
    secured: false,
    query: listStatesQuerySchema,
    successStatus: '200',
    successDescription: 'Estados em ordem alfabética.',
    successSchema: dataEnvelope(z.array(stateResponseSchema)),
    errorStatuses: ['400']
  },
  {
    method: 'get',
    path: '/locations/states/{uf}/municipalities',
    summary: 'Lista os municípios cadastrados de um estado.',
    tag: 'Referências',
    secured: false,
    pathParams: stateParamsSchema,
    successStatus: '200',
    successDescription: 'Municípios em ordem alfabética.',
    successSchema: dataEnvelope(z.array(municipalityResponseSchema)),
    errorStatuses: ['400', '404']
  },
  {
    method: 'get',
    path: '/admin/films',
    summary: 'Lista todos os filmes, inclusive não publicados.',
    tag: 'Administração de filmes',
    secured: true,
    query: listAdminFilmsQuerySchema,
    successStatus: '200',
    successDescription: 'Página de filmes.',
    successSchema: paginatedFilmsResponseSchema,
    errorStatuses: ['400', '401', '403']
  },
  {
    method: 'get',
    path: '/admin/films/{id}',
    summary: 'Detalha qualquer filme, com o vídeo completo.',
    tag: 'Administração de filmes',
    secured: true,
    pathParams: filmIdParamsSchema,
    successStatus: '200',
    successDescription: 'Filme encontrado.',
    successSchema: dataEnvelope(filmResponseSchema),
    errorStatuses: ['400', '401', '403', '404']
  },
  {
    method: 'post',
    path: '/admin/films',
    summary: 'Cadastra um filme.',
    tag: 'Administração de filmes',
    secured: true,
    body: createFilmSchema,
    successStatus: '201',
    successDescription: 'Filme cadastrado.',
    successSchema: messageEnvelope(filmResponseSchema),
    errorStatuses: ['400', '401', '403', '422']
  },
  {
    method: 'patch',
    path: '/admin/films/{id}',
    summary: 'Atualiza parcialmente um filme.',
    tag: 'Administração de filmes',
    secured: true,
    pathParams: filmIdParamsSchema,
    body: updateFilmSchema,
    successStatus: '200',
    successDescription: 'Filme atualizado.',
    successSchema: messageEnvelope(filmResponseSchema),
    errorStatuses: ['400', '401', '403', '404', '422']
  },
  {
    method: 'delete',
    path: '/admin/films/{id}',
    summary: 'Remove um filme.',
    tag: 'Administração de filmes',
    secured: true,
    pathParams: filmIdParamsSchema,
    successStatus: '204',
    successDescription: 'Filme removido.',
    errorStatuses: ['400', '401', '403', '404']
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
    ...(operation.secured ? { security: [{ bearerAuth: [] }] } : {}),
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
      description: 'Contrato gerado a partir dos schemas Zod do backend.'
    },
    servers: [{ url: '/api' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    paths
  };
}
