import { RegiaoBrasil } from '@prisma/client';
import { z } from 'zod';

export const listStatesQuerySchema = z.object({
  regiao: z.enum(RegiaoBrasil, 'Região inválida.').optional()
});

export const stateParamsSchema = z.object({
  uf: z
    .string()
    .trim()
    .length(2, 'A UF deve ter 2 letras.')
    .transform(value => value.toUpperCase())
});

export type ListStatesQuery = z.infer<typeof listStatesQuerySchema>;

export const stateResponseSchema = z.object({
  id: z.string(),
  uf: z.string(),
  nome: z.string(),
  regiao: z.enum(RegiaoBrasil)
});

export const municipalityResponseSchema = z.object({
  id: z.string(),
  nome: z.string()
});

export type StateResponse = z.infer<typeof stateResponseSchema>;
export type MunicipalityResponse = z.infer<typeof municipalityResponseSchema>;
