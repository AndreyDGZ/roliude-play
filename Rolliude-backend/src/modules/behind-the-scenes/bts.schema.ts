import { z } from 'zod';

export const TIPOS_BASTIDORES = ['making_of', 'entrevista', 'minidoc', 'depoimento', 'curiosidade', 'galeria_fotos'] as const;

const requiredText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, 'O campo não pode ser vazio.')
    .max(maxLength, `O campo não pode exceder ${maxLength} caracteres.`);

const optionalText = (maxLength: number) => requiredText(maxLength).nullish();

export const createBtsItemSchema = z.object({
  filmeId: z.uuid('Identificador de filme inválido.'),
  titulo: requiredText(255),
  tipo: z.enum(TIPOS_BASTIDORES, 'Tipo de conteúdo inválido.'),
  descricao: requiredText(2000),
  duracao: optionalText(30),
  thumbnailUrl: requiredText(2048),
  videoUrl: optionalText(2048),
  galeriaFotos: z.array(requiredText(2048)).optional(),
  entrevistado: optionalText(255),
  dataPublicacao: z.iso.date('Data de publicação inválida.')
});

export const updateBtsItemSchema = createBtsItemSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, 'Informe ao menos um campo para atualização.');

export const btsIdParamsSchema = z.object({
  id: z.uuid('Identificador de conteúdo inválido.')
});

export const listBtsQuerySchema = z.object({
  filmeId: z.uuid('Identificador de filme inválido.').optional()
});

export const btsItemResponseSchema = z.object({
  id: z.string(),
  filmeId: z.string(),
  titulo: z.string(),
  tipo: z.enum(TIPOS_BASTIDORES),
  descricao: z.string(),
  duracao: z.string().nullable(),
  thumbnailUrl: z.string(),
  videoUrl: z.string().nullable(),
  galeriaFotos: z.array(z.string()),
  entrevistado: z.string().nullable(),
  dataPublicacao: z.string()
});

export type BtsItemResponse = z.infer<typeof btsItemResponseSchema>;
export type CreateBtsItemInput = z.infer<typeof createBtsItemSchema>;
export type UpdateBtsItemInput = z.infer<typeof updateBtsItemSchema>;
export type ListBtsQuery = z.infer<typeof listBtsQuerySchema>;
