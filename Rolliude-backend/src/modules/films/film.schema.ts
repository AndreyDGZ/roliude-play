import { RegiaoBrasil } from '@prisma/client';
import { z } from 'zod';

export const CLASSIFICACOES_INDICATIVAS = ['L', '10', '12', '14', '16', '18'] as const;
export const ORDENACOES_CATALOGO = ['recentes', 'titulo', 'ano'] as const;

const MIN_RELEASE_YEAR = 1888;
const MAX_RELEASE_YEAR = new Date().getFullYear() + 1;
const MAX_DURATION_MINUTES = 1000;
const MAX_GENRES_PER_FILM = 10;
const MAX_PAGE_SIZE = 48;
const DEFAULT_PAGE_SIZE = 12;

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

const httpsUrl = z
  .string()
  .trim()
  .max(2048, 'A URL não pode exceder 2048 caracteres.')
  .url('Formato de URL inválido.')
  .refine(isHttpsUrl, 'A URL deve usar HTTPS.');

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, 'O campo não pode ser vazio.')
    .max(maxLength, `O campo não pode exceder ${maxLength} caracteres.`)
    .nullish();

export const createFilmSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, 'O título é obrigatório.')
    .max(255, 'O título não pode exceder 255 caracteres.'),
  tituloOriginal: optionalText(255),
  sinopse: optionalText(5000),
  anoLancamento: z
    .number()
    .int('O ano deve ser um número inteiro.')
    .min(MIN_RELEASE_YEAR, `O ano deve ser no mínimo ${MIN_RELEASE_YEAR}.`)
    .max(MAX_RELEASE_YEAR, `O ano deve ser no máximo ${MAX_RELEASE_YEAR}.`)
    .nullish(),
  duracaoMin: z
    .number()
    .int('A duração deve ser um número inteiro.')
    .min(1, 'A duração deve ser de pelo menos 1 minuto.')
    .max(MAX_DURATION_MINUTES, `A duração deve ser de no máximo ${MAX_DURATION_MINUTES} minutos.`)
    .nullish(),
  classificacaoIndicativa: z.enum(CLASSIFICACOES_INDICATIVAS, 'Classificação indicativa inválida.').optional(),
  idiomaOriginal: optionalText(60),
  posterUrl: httpsUrl.nullish(),
  trailerUrl: httpsUrl.nullish(),
  videoUrl: httpsUrl.nullish(),
  dominioPublico: z.boolean().optional(),
  publicado: z.boolean().optional(),
  municipioId: z.uuid('Identificador de município inválido.').nullish(),
  generoIds: z
    .array(z.uuid('Identificador de gênero inválido.'))
    .max(MAX_GENRES_PER_FILM, `Informe no máximo ${MAX_GENRES_PER_FILM} gêneros.`)
    .refine(genreIds => new Set(genreIds).size === genreIds.length, 'Os gêneros não podem se repetir.')
    .optional()
});

export const updateFilmSchema = createFilmSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, 'Informe ao menos um campo para atualização.');

export const filmIdParamsSchema = z.object({
  id: z.uuid('Identificador de filme inválido.')
});

const MAX_SEARCH_LENGTH = 100;

const catalogShape = {
  busca: z.string().trim().max(MAX_SEARCH_LENGTH, `A busca não pode exceder ${MAX_SEARCH_LENGTH} caracteres.`).optional(),
  regiao: z.enum(RegiaoBrasil, 'Região inválida.').optional(),
  uf: z
    .string()
    .trim()
    .length(2, 'A UF deve ter 2 letras.')
    .transform(value => value.toUpperCase())
    .optional(),
  municipioId: z.uuid('Identificador de município inválido.').optional(),
  generoId: z.uuid('Identificador de gênero inválido.').optional(),
  ano: z.coerce
    .number()
    .int('O ano deve ser um número inteiro.')
    .min(MIN_RELEASE_YEAR, `O ano deve ser no mínimo ${MIN_RELEASE_YEAR}.`)
    .max(MAX_RELEASE_YEAR, `O ano deve ser no máximo ${MAX_RELEASE_YEAR}.`)
    .optional()
};

const paginationShape = {
  pagina: z.coerce.number().int().min(1, 'A página deve ser no mínimo 1.').default(1),
  limite: z.coerce
    .number()
    .int()
    .min(1, 'O limite deve ser no mínimo 1.')
    .max(MAX_PAGE_SIZE, `O limite deve ser no máximo ${MAX_PAGE_SIZE}.`)
    .default(DEFAULT_PAGE_SIZE),
  ordenar: z.enum(ORDENACOES_CATALOGO, 'Ordenação inválida.').default('recentes')
};

export const listFilmsQuerySchema = z.object({ ...catalogShape, ...paginationShape });

export const listAdminFilmsQuerySchema = z.object({
  ...catalogShape,
  ...paginationShape,
  publicado: z.enum(['true', 'false'], 'O filtro de publicação deve ser true ou false.').optional()
});

export const filmResponseSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  tituloOriginal: z.string().nullable(),
  sinopse: z.string().nullable(),
  anoLancamento: z.number().int().nullable(),
  duracaoMin: z.number().int().nullable(),
  classificacaoIndicativa: z.enum(CLASSIFICACOES_INDICATIVAS),
  idiomaOriginal: z.string().nullable(),
  posterUrl: z.string().nullable(),
  trailerUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
  dominioPublico: z.boolean(),
  publicado: z.boolean(),
  municipio: z
    .object({
      id: z.string(),
      nome: z.string(),
      estado: z.object({ id: z.string(), uf: z.string(), nome: z.string(), regiao: z.enum(RegiaoBrasil) })
    })
    .nullable(),
  generos: z.array(z.object({ id: z.string(), nome: z.string() })),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const paginatedFilmsResponseSchema = z.object({
  data: z.array(filmResponseSchema),
  meta: z.object({
    pagina: z.number().int(),
    limite: z.number().int(),
    total: z.number().int(),
    totalPaginas: z.number().int()
  })
});

export type FilmResponse = z.infer<typeof filmResponseSchema>;
export type PaginatedFilms = z.infer<typeof paginatedFilmsResponseSchema>;
export type CreateFilmInput = z.infer<typeof createFilmSchema>;
export type UpdateFilmInput = z.infer<typeof updateFilmSchema>;
export type ListFilmsQuery = z.infer<typeof listFilmsQuerySchema>;
export type ListAdminFilmsQuery = z.infer<typeof listAdminFilmsQuerySchema>;
