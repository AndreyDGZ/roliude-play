import { Prisma } from '@prisma/client';

export const authenticatedUserSelect = {
  id: true,
  nome: true,
  email: true,
  papel: true,
  createdAt: true
} satisfies Prisma.UsuarioSelect;

export type AuthenticatedUser = Prisma.UsuarioGetPayload<{ select: typeof authenticatedUserSelect }>;
