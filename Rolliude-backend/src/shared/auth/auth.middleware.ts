import { NextFunction, Request, Response } from 'express';
import { PapelUsuario } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../errors/app-error';
import { readUserIdFromAccessToken } from './access-token';
import { authenticatedUserSelect } from './authenticated-user';

const BEARER_PREFIX = 'Bearer ';

function extractBearerToken(request: Request): string | null {
  const header = request.headers.authorization;

  if (!header?.startsWith(BEARER_PREFIX)) {
    return null;
  }

  return header.slice(BEARER_PREFIX.length).trim() || null;
}

export async function authenticate(request: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractBearerToken(request);

    if (!token) {
      throw new AppError('Autenticação necessária.', 401);
    }

    const userId = readUserIdFromAccessToken(token);
    const user = userId
      ? await prisma.usuario.findUnique({ where: { id: userId }, select: authenticatedUserSelect })
      : null;

    if (!user) {
      throw new AppError('Sessão inválida ou expirada.', 401);
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(request: Request, _response: Response, next: NextFunction): void {
  if (request.user?.papel !== PapelUsuario.ADMIN) {
    next(new AppError('Acesso restrito a administradores.', 403));
    return;
  }

  next();
}

export const adminOnly = [authenticate, requireAdmin];
