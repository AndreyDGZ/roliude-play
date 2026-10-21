import { z } from 'zod';

export const movieBodySchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  tituloOriginal: z.string().optional(),
  sinopse: z.string().optional(),
  anoLancamento: z.coerce.number().int().optional(),
  duracaoMin: z.coerce.number().int().optional(),
  posterUrl: z.string().optional(),
  trailerUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  dominioPublico: z.boolean().default(false),
  publicado: z.boolean().default(false),
  municipioId: z.string().optional(),
  generoIds: z.array(z.string()).min(1, 'Informe ao menos um gênero').max(8).optional()
});

export const movieUpdateSchema = movieBodySchema.partial();

export const publicadoBodySchema = z.object({
  publicado: z.boolean()
});

export const idParamsSchema = z.object({
  id: z.string()
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  publicado: z.coerce.boolean().optional(),
  generoId: z.string().optional()
});

export type MovieInput = z.infer<typeof movieBodySchema>;
export type MovieUpdateInput = z.infer<typeof movieUpdateSchema>;
export type MovieListQuery = z.infer<typeof listQuerySchema>;