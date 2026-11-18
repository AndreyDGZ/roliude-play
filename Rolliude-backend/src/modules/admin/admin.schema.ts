import { z } from 'zod';
import { PAPEIS_USUARIO, userResponseSchema } from '../auth/auth.schema';

const MAX_PAGE_SIZE = 48;
const DEFAULT_PAGE_SIZE = 20;

export const listUsersQuerySchema = z.object({
  pagina: z.coerce.number().int().min(1, 'A página deve ser no mínimo 1.').default(1),
  limite: z.coerce
    .number()
    .int()
    .min(1, 'O limite deve ser no mínimo 1.')
    .max(MAX_PAGE_SIZE, `O limite deve ser no máximo ${MAX_PAGE_SIZE}.`)
    .default(DEFAULT_PAGE_SIZE)
});

export const userIdParamsSchema = z.object({
  id: z.uuid('Identificador de usuário inválido.')
});

export const updateUserRoleSchema = z.object({
  papel: z.enum(PAPEIS_USUARIO, 'Papel inválido.')
});

export const adminOverviewResponseSchema = z.object({
  totais: z.object({
    filmes: z.number().int(),
    profissionais: z.number().int(),
    bastidores: z.number().int(),
    avaliacoes: z.number().int(),
    usuarios: z.number().int()
  }),
  ultimosFilmes: z.array(
    z.object({
      id: z.string(),
      titulo: z.string(),
      cadastradoEm: z.iso.datetime()
    })
  )
});

export const paginatedUsersResponseSchema = z.object({
  data: z.array(userResponseSchema),
  meta: z.object({
    pagina: z.number().int(),
    limite: z.number().int(),
    total: z.number().int(),
    totalPaginas: z.number().int()
  })
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type AdminOverviewResponse = z.infer<typeof adminOverviewResponseSchema>;
export type PaginatedUsers = z.infer<typeof paginatedUsersResponseSchema>;
