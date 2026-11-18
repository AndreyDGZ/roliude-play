import { PapelUsuario, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { authenticatedUserSelect } from '../../shared/auth/authenticated-user';
import { AppError } from '../../shared/errors/app-error';
import { toUserResponse } from '../auth/auth.mapper';
import { UserResponse } from '../auth/auth.schema';
import { AdminOverviewResponse, ListUsersQuery, PaginatedUsers, UpdateUserRoleInput } from './admin.schema';

const RECENT_MOVIES_LIMIT = 5;

export class AdminService {
  async getOverview(): Promise<AdminOverviewResponse> {
    const [filmes, profissionais, bastidores, avaliacoes, usuarios, recentMovies] = await prisma.$transaction([
      prisma.filme.count(),
      prisma.profissional.count(),
      prisma.itemBastidores.count(),
      prisma.avaliacao.count(),
      prisma.usuario.count(),
      prisma.filme.findMany({
        orderBy: { createdAt: 'desc' },
        take: RECENT_MOVIES_LIMIT,
        select: { id: true, titulo: true, createdAt: true }
      })
    ]);

    return {
      totais: { filmes, profissionais, bastidores, avaliacoes, usuarios },
      ultimosFilmes: recentMovies.map(movie => ({
        id: movie.id,
        titulo: movie.titulo,
        cadastradoEm: movie.createdAt.toISOString()
      }))
    };
  }

  async listUsers(query: ListUsersQuery): Promise<PaginatedUsers> {
    const [total, users] = await prisma.$transaction([
      prisma.usuario.count(),
      prisma.usuario.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        select: authenticatedUserSelect
      })
    ]);

    return {
      data: users.map(toUserResponse),
      meta: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite)
      }
    };
  }

  async updateUserRole(actingUserId: string, targetUserId: string, data: UpdateUserRoleInput): Promise<UserResponse> {
    if (actingUserId === targetUserId) {
      throw new AppError('Você não pode alterar o próprio papel.', 409);
    }

    const updated = await prisma.$transaction(async transaction => {
      const target = await transaction.usuario.findUnique({ where: { id: targetUserId }, select: { papel: true } });

      if (!target) {
        throw new AppError('Usuário não encontrado.', 404);
      }

      const isDemotingAdmin = target.papel === PapelUsuario.ADMIN && data.papel !== PapelUsuario.ADMIN;
      const adminCount = isDemotingAdmin ? await transaction.usuario.count({ where: { papel: PapelUsuario.ADMIN } }) : 0;

      if (isDemotingAdmin && adminCount <= 1) {
        throw new AppError('Não é possível remover o último administrador.', 409);
      }

      return transaction.usuario.update({
        where: { id: targetUserId },
        data: { papel: data.papel },
        select: authenticatedUserSelect
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return toUserResponse(updated);
  }
}
