import { z } from 'zod';

export const genreResponseSchema = z.object({
  id: z.string(),
  nome: z.string()
});

export type GenreResponse = z.infer<typeof genreResponseSchema>;
