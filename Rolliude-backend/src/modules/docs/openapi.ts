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
import {
  listNotificationsQuerySchema,
  notificationDeviceBodySchema,
  notificationIdParamsSchema,
  notificationListResponseSchema,
  notificationResponseSchema
} from '../notifications/notification.schema';
import { createReviewSchema, listReviewsQuerySchema, paginatedReviewsResponseSchema, reviewIdParamsSchema } from '../reviews/review.schema';
import { authSessionResponseSchema, loginSchema, registerSchema, userResponseSchema } from '../auth/auth.schema';
import {
  adminOverviewResponseSchema,
  listUsersQuerySchema,
  paginatedUsersResponseSchema,
  updateUserRoleSchema,
  userIdParamsSchema
} from '../admin/admin.schema';

type JsonObject = Record<string, unknown>;
type HttpMethod = 'get' | 'post' | 'patch' | 'delete';
type AccessLevel = 'user' | 'admin';

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
  successContentType?: string;
  errorStatuses: string[];
  access?: AccessLevel;
}

const ERROR_DESCRIPTIONS: Record<string, string> = {
  '400': 'Erro de validação nos campos fornecidos.',
  '401': 'Autenticação necessária ou sessão inválida.',
  '403': 'Acesso restrito a administradores.',
  '404': 'Recurso não encontrado.',
  '409': 'Conflito com o estado atual do recurso.',
  '422': 'Referência a registro inexistente.'
};

const ACCESS_ERROR_STATUSES: Record<AccessLevel, string[]> = {
  user: ['401'],
  admin: ['401', '403']
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
    access: 'admin',
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
    access: 'admin',
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
    access: 'admin',
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
    access: 'admin',
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
    access: 'admin',
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
    access: 'admin',
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
    access: 'admin',
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
    access: 'admin',
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
    access: 'admin',
    summary: 'Remove um conteúdo de bastidores.',
    tag: 'Bastidores',
    pathParams: btsIdParamsSchema,
    successStatus: '204',
    successDescription: 'Conteúdo removido.',
    errorStatuses: ['400', '404']
  },
  {
    method: 'get',
    path: '/notifications',
    summary: 'Lista as notificações de lançamento dos últimos 30 dias para um dispositivo.',
    tag: 'Notificações',
    query: listNotificationsQuerySchema,
    successStatus: '200',
    successDescription: 'Notificações com estado de leitura e total de não lidas.',
    successSchema: notificationListResponseSchema,
    errorStatuses: ['400']
  },
  {
    method: 'get',
    path: '/notifications/stream',
    summary: 'Abre o canal em tempo real (SSE) que envia o evento release a cada filme lançado.',
    tag: 'Notificações',
    successStatus: '200',
    successDescription: 'Fluxo text/event-stream; cada evento release traz uma notificação.',
    successSchema: notificationResponseSchema,
    successContentType: 'text/event-stream',
    errorStatuses: []
  },
  {
    method: 'post',
    path: '/notifications/{id}/read',
    summary: 'Marca uma notificação como lida para o dispositivo.',
    tag: 'Notificações',
    pathParams: notificationIdParamsSchema,
    body: notificationDeviceBodySchema,
    successStatus: '204',
    successDescription: 'Notificação marcada como lida.',
    errorStatuses: ['400', '404']
  },
  {
    method: 'post',
    path: '/notifications/read-all',
    summary: 'Marca todas as notificações recentes como lidas para o dispositivo.',
    tag: 'Notificações',
    body: notificationDeviceBodySchema,
    successStatus: '204',
    successDescription: 'Notificações marcadas como lidas.',
    errorStatuses: ['400']
  },
  {
    method: 'post',
    path: '/auth/register',
    summary: 'Cria uma conta de usuário comum.',
    tag: 'Autenticação',
    body: registerSchema,
    successStatus: '201',
    successDescription: 'Conta criada; retorna o token e o usuário.',
    successSchema: messageEnvelope(authSessionResponseSchema),
    errorStatuses: ['400', '409']
  },
  {
    method: 'post',
    path: '/auth/login',
    summary: 'Autentica com e-mail e senha.',
    tag: 'Autenticação',
    body: loginSchema,
    successStatus: '200',
    successDescription: 'Sessão aberta; retorna o token e o usuário.',
    successSchema: dataEnvelope(authSessionResponseSchema),
    errorStatuses: ['400', '401']
  },
  {
    method: 'get',
    path: '/auth/me',
    access: 'user',
    summary: 'Retorna o usuário dono do token.',
    tag: 'Autenticação',
    successStatus: '200',
    successDescription: 'Usuário autenticado.',
    successSchema: dataEnvelope(userResponseSchema),
    errorStatuses: []
  },
  {
    method: 'get',
    path: '/admin/overview',
    access: 'admin',
    summary: 'Totais do catálogo e últimos filmes cadastrados.',
    tag: 'Administração',
    successStatus: '200',
    successDescription: 'Visão geral do painel.',
    successSchema: dataEnvelope(adminOverviewResponseSchema),
    errorStatuses: []
  },
  {
    method: 'get',
    path: '/admin/users',
    access: 'admin',
    summary: 'Lista os usuários cadastrados.',
    tag: 'Administração',
    query: listUsersQuerySchema,
    successStatus: '200',
    successDescription: 'Página de usuários.',
    successSchema: paginatedUsersResponseSchema,
    errorStatuses: ['400']
  },
  {
    method: 'patch',
    path: '/admin/users/{id}/role',
    access: 'admin',
    summary: 'Altera o papel de um usuário.',
    tag: 'Administração',
    pathParams: userIdParamsSchema,
    body: updateUserRoleSchema,
    successStatus: '200',
    successDescription: 'Papel atualizado.',
    successSchema: messageEnvelope(userResponseSchema),
    errorStatuses: ['400', '404', '409']
  },
  {
    method: 'get',
    path: '/reviews',
    access: 'admin',
    summary: 'Lista as avaliações mais recentes para moderação.',
    tag: 'Avaliações',
    query: listReviewsQuerySchema,
    successStatus: '200',
    successDescription: 'Página de avaliações.',
    successSchema: paginatedReviewsResponseSchema,
    errorStatuses: ['400']
  },
  {
    method: 'delete',
    path: '/reviews/{id}',
    access: 'admin',
    summary: 'Remove uma avaliação e recalcula a nota do filme.',
    tag: 'Avaliações',
    pathParams: reviewIdParamsSchema,
    successStatus: '204',
    successDescription: 'Avaliação removida.',
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
    ? { content: { [operation.successContentType ?? 'application/json']: { schema: toJsonSchema(operation.successSchema, 'output') } } }
    : {};

  const errorStatuses = operation.access ? [...operation.errorStatuses, ...ACCESS_ERROR_STATUSES[operation.access]] : operation.errorStatuses;

  const errorResponses = Object.fromEntries(
    errorStatuses.map(status => [
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
    ...(operation.access ? { security: [{ bearerAuth: [] }] } : {}),
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
      description: 'Contrato gerado a partir dos schemas Zod do backend. Rotas marcadas com bearerAuth exigem o token JWT obtido em /auth/login.'
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    paths
  };
}
