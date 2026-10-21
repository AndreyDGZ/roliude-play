import { StatusFilme } from '@prisma/client';
import { z } from 'zod';

export const classificacoesIndicativas = ['L', '10', '12', '14', '16', '18'] as const;

const optionalUrl = z
  .union([z.string().url('URL inválida'), z.literal('')])
  .optional()
  .transform((value) => (value ? value : undefined));

export const movieBodySchema = z.object({
  titulo: z.string().trim().min(1, 'Título obrigatório').max(160),
  sinopse: z.string().trim().min(10, 'Sinopse muito curta').max(5000),
  diretor: z.string().trim().min(1, 'Diretor obrigatório').max(120),
  anoLancamento: z.coerce
    .number()
    .int()
    .min(1895)
    .max(new Date().getFullYear() + 2),
  duracaoMinutos: z.coerce.number().int().min(1).max(600),
  idioma: z.string().trim().min(2).max(10).default('pt-BR'),
  classificacaoIndicativa: z.enum(classificacoesIndicativas).optional(),
  posterUrl: optionalUrl,
  trailerUrl: optionalUrl,
  videoUrl: optionalUrl,
  dominioPublico: z.boolean().default(false),
  status: z.nativeEnum(StatusFilme).default(StatusFilme.RASCUNHO),
  generoIds: z.array(z.string().uuid()).min(1, 'Informe ao menos um gênero').max(8),
});

export const movieUpdateSchema = movieBodySchema.partial();

export const statusBodySchema = z.object({
  status: z.nativeEnum(StatusFilme),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.nativeEnum(StatusFilme).optional(),
});

export type MovieInput = z.infer<typeof movieBodySchema>;
export type MovieUpdateInput = z.infer<typeof movieUpdateSchema>;
export type MovieListQuery = z.infer<typeof listQuerySchema>;
