import { z } from 'zod';

export const FUNCOES_PROFISSIONAL = [
  'Diretor(a)',
  'Ator/Atriz',
  'Roteirista',
  'Produtor(a)',
  'Diretor(a) de Fotografia',
  'Compositor(a)'
] as const;

const requiredText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, 'O campo não pode ser vazio.')
    .max(maxLength, `O campo não pode exceder ${maxLength} caracteres.`);

export const createProfessionalSchema = z.object({
  nome: requiredText(255),
  funcoes: z
    .array(z.enum(FUNCOES_PROFISSIONAL, 'Função inválida.'))
    .min(1, 'Informe ao menos uma função.')
    .max(FUNCOES_PROFISSIONAL.length),
  foto: requiredText(2048),
  cidadeNatal: requiredText(255),
  estadoNatal: requiredText(255),
  biografia: requiredText(5000),
  premios: z.array(requiredText(500)),
  filmesIds: z.array(z.uuid('Identificador de filme inválido.')).optional()
});

export const updateProfessionalSchema = createProfessionalSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, 'Informe ao menos um campo para atualização.');

export const professionalIdParamsSchema = z.object({
  id: z.uuid('Identificador de profissional inválido.')
});

const MAX_PAGE_SIZE = 48;
const DEFAULT_PAGE_SIZE = 24;

export const listProfessionalsQuerySchema = z.object({
  pagina: z.coerce.number().int().min(1, 'A página deve ser no mínimo 1.').default(1),
  limite: z.coerce
    .number()
    .int()
    .min(1, 'O limite deve ser no mínimo 1.')
    .max(MAX_PAGE_SIZE, `O limite deve ser no máximo ${MAX_PAGE_SIZE}.`)
    .default(DEFAULT_PAGE_SIZE)
});

const relatedMovieSchema = z.object({
  id: z.string(),
  titulo: z.string()
});

export const professionalResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  funcoes: z.array(z.enum(FUNCOES_PROFISSIONAL)),
  foto: z.string(),
  cidadeNatal: z.string(),
  estadoNatal: z.string(),
  biografia: z.string(),
  premios: z.array(z.string()),
  filmes: z.array(relatedMovieSchema)
});

export const paginatedProfessionalsResponseSchema = z.object({
  data: z.array(professionalResponseSchema),
  meta: z.object({
    pagina: z.number().int(),
    limite: z.number().int(),
    total: z.number().int(),
    totalPaginas: z.number().int()
  })
});

export type ProfessionalResponse = z.infer<typeof professionalResponseSchema>;
export type PaginatedProfessionals = z.infer<typeof paginatedProfessionalsResponseSchema>;
export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>;
export type ListProfessionalsQuery = z.infer<typeof listProfessionalsQuerySchema>;
