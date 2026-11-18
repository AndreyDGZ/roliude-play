import { z } from 'zod';

export const CLASSIFICACOES_INDICATIVAS = ['Livre', '10', '12', '14', '16', '18'] as const;
export const ORDENACOES_CATALOGO = ['recentes', 'titulo', 'ano'] as const;

const MIN_RELEASE_YEAR = 1888;
const MAX_RELEASE_YEAR = new Date().getFullYear() + 1;
const MAX_DURATION_MINUTES = 1000;
const MAX_PAGE_SIZE = 48;
const DEFAULT_PAGE_SIZE = 12;

const requiredText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, 'O campo não pode ser vazio.')
    .max(maxLength, `O campo não pode exceder ${maxLength} caracteres.`);

const optionalText = (maxLength: number) => requiredText(maxLength).nullish();

const stringList = (maxLength: number) => z.array(requiredText(maxLength));

const castMemberSchema = z.object({
  nome: requiredText(255),
  personagem: requiredText(255),
  foto: z.string().trim().max(2048).nullish()
});

const localizacaoSchema = z.object({
  pais: requiredText(100),
  regiao: z.enum(['Nordeste', 'Norte', 'Centro-Oeste', 'Sudeste', 'Sul'], 'Região inválida.'),
  estado: requiredText(100),
  estadoSigla: requiredText(10),
  municipio: requiredText(255)
});

export const createMovieSchema = z.object({
  titulo: requiredText(255),
  tituloOriginal: optionalText(255),
  sinopse: requiredText(5000),
  posterUrl: requiredText(2048),
  backdropUrl: requiredText(2048),
  trailerUrl: requiredText(2048),
  videoUrl: requiredText(2048),
  ano: z.number().int().min(MIN_RELEASE_YEAR).max(MAX_RELEASE_YEAR),
  duracaoMinutos: z.number().int().min(1).max(MAX_DURATION_MINUTES),
  genero: stringList(60).max(10, 'Informe no máximo 10 gêneros.'),
  classificacaoIndicativa: z.enum(CLASSIFICACOES_INDICATIVAS, 'Classificação indicativa inválida.'),
  localizacao: localizacaoSchema,
  direcao: stringList(255),
  roteiro: stringList(255),
  producao: stringList(255),
  elenco: z.array(castMemberSchema).max(100, 'Informe no máximo 100 integrantes de elenco.'),
  fotografia: requiredText(255),
  trilhaSonora: requiredText(255),
  produtora: requiredText(255),
  premios: stringList(500),
  curiosidades: stringList(1000),
  destaqueCuradoria: z.boolean().optional(),
  curadoriaTag: optionalText(120),
  popularidade: z.number().int().min(0).max(100).optional(),
  profissionalIds: z.array(z.uuid('Identificador de profissional inválido.')).optional()
});

export const updateMovieSchema = createMovieSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, 'Informe ao menos um campo para atualização.');

export const movieIdParamsSchema = z.object({
  id: z.uuid('Identificador de filme inválido.')
});

const MAX_SEARCH_LENGTH = 100;

export const listMoviesQuerySchema = z.object({
  busca: z.string().trim().max(MAX_SEARCH_LENGTH, `A busca não pode exceder ${MAX_SEARCH_LENGTH} caracteres.`).optional(),
  pagina: z.coerce.number().int().min(1, 'A página deve ser no mínimo 1.').default(1),
  limite: z.coerce
    .number()
    .int()
    .min(1, 'O limite deve ser no mínimo 1.')
    .max(MAX_PAGE_SIZE, `O limite deve ser no máximo ${MAX_PAGE_SIZE}.`)
    .default(DEFAULT_PAGE_SIZE),
  ordenar: z.enum(ORDENACOES_CATALOGO, 'Ordenação inválida.').default('recentes')
});

const castMemberResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  personagem: z.string(),
  foto: z.string().nullable()
});

const reviewResponseSchema = z.object({
  id: z.string(),
  autor: z.string(),
  cidade: z.string(),
  nota: z.number().int(),
  comentario: z.string(),
  data: z.string()
});

const professionalSummarySchema = z.object({
  id: z.string(),
  nome: z.string()
});

export const movieResponseSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  tituloOriginal: z.string().nullable(),
  sinopse: z.string(),
  posterUrl: z.string(),
  backdropUrl: z.string(),
  trailerUrl: z.string(),
  videoUrl: z.string(),
  ano: z.number().int(),
  duracaoMinutos: z.number().int(),
  genero: z.array(z.string()),
  classificacaoIndicativa: z.enum(CLASSIFICACOES_INDICATIVAS),
  localizacao: localizacaoSchema,
  direcao: z.array(z.string()),
  roteiro: z.array(z.string()),
  producao: z.array(z.string()),
  elenco: z.array(castMemberResponseSchema),
  fotografia: z.string(),
  trilhaSonora: z.string(),
  produtora: z.string(),
  premios: z.array(z.string()),
  curiosidades: z.array(z.string()),
  destaqueCuradoria: z.boolean(),
  curadoriaTag: z.string().nullable(),
  popularidade: z.number().int(),
  notaMedia: z.number(),
  avaliacoesCount: z.number().int(),
  lancadoEm: z.iso.datetime().nullable(),
  reviews: z.array(reviewResponseSchema),
  profissionais: z.array(professionalSummarySchema)
});

export const paginatedMoviesResponseSchema = z.object({
  data: z.array(movieResponseSchema),
  meta: z.object({
    pagina: z.number().int(),
    limite: z.number().int(),
    total: z.number().int(),
    totalPaginas: z.number().int()
  })
});

export type MovieResponse = z.infer<typeof movieResponseSchema>;
export type PaginatedMovies = z.infer<typeof paginatedMoviesResponseSchema>;
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type ListMoviesQuery = z.infer<typeof listMoviesQuerySchema>;
