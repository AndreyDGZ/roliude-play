import { PapelUsuario } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from '../shared/errors/app-error';

export interface AuthenticatedUser {
  id: string;
  email: string;
  papel: PapelUsuario;
}

declare global {
  namespace Express {
    interface Locals {
      usuario?: AuthenticatedUser;
    }
  }
}

const BEARER_PREFIX = 'Bearer ';

function extractToken(request: Request): string {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith(BEARER_PREFIX)) {
    throw new AppError('Autenticação necessária.', 401);
  }

  return authorization.slice(BEARER_PREFIX.length).trim();
}

function extractUserId(token: string): string {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === 'object' && typeof payload.sub === 'string') {
      return payload.sub;
    }
  } catch {
    throw new AppError('Token inválido ou expirado.', 401);
  }

  throw new AppError('Token inválido ou expirado.', 401);
}

export async function authenticate(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const userId = extractUserId(extractToken(request));
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { id: true, email: true, papel: true }
    });

    if (!user) {
      throw new AppError('Token inválido ou expirado.', 401);
    }

    response.locals.usuario = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...allowedRoles: PapelUsuario[]) {
  return (_request: Request, response: Response, next: NextFunction): void => {
    const user = response.locals.usuario;

    if (!user) {
      next(new AppError('Autenticação necessária.', 401));
      return;
    }

    if (!allowedRoles.includes(user.papel)) {
      next(new AppError('Você não tem permissão para realizar esta ação.', 403));
      return;
    }

    next();
  };
}
