import { z } from 'zod';

export const createReviewSchema = z.object({
  autor: z.string().trim().min(1, 'O autor é obrigatório.').max(255, 'O autor não pode exceder 255 caracteres.'),
  cidade: z.string().trim().min(1, 'A cidade é obrigatória.').max(255, 'A cidade não pode exceder 255 caracteres.'),
  nota: z.number().int().min(1, 'A nota deve ser no mínimo 1.').max(5, 'A nota deve ser no máximo 5.'),
  comentario: z
    .string()
    .trim()
    .min(1, 'O comentário é obrigatório.')
    .max(2000, 'O comentário não pode exceder 2000 caracteres.')
});

export const movieIdParamsSchema = z.object({
  id: z.uuid('Identificador de filme inválido.')
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

const MAX_PAGE_SIZE = 48;
const DEFAULT_PAGE_SIZE = 20;

export const reviewIdParamsSchema = z.object({
  id: z.uuid('Identificador de avaliação inválido.')
});

export const listReviewsQuerySchema = z.object({
  pagina: z.coerce.number().int().min(1, 'A página deve ser no mínimo 1.').default(1),
  limite: z.coerce
    .number()
    .int()
    .min(1, 'O limite deve ser no mínimo 1.')
    .max(MAX_PAGE_SIZE, `O limite deve ser no máximo ${MAX_PAGE_SIZE}.`)
    .default(DEFAULT_PAGE_SIZE)
});

export const moderatedReviewResponseSchema = z.object({
  id: z.string(),
  autor: z.string(),
  cidade: z.string(),
  nota: z.number().int(),
  comentario: z.string(),
  data: z.iso.datetime(),
  filme: z.object({ id: z.string(), titulo: z.string() })
});

export const paginatedReviewsResponseSchema = z.object({
  data: z.array(moderatedReviewResponseSchema),
  meta: z.object({
    pagina: z.number().int(),
    limite: z.number().int(),
    total: z.number().int(),
    totalPaginas: z.number().int()
  })
});

export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;
export type ModeratedReviewResponse = z.infer<typeof moderatedReviewResponseSchema>;
export type PaginatedReviews = z.infer<typeof paginatedReviewsResponseSchema>;
