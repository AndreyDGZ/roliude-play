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
