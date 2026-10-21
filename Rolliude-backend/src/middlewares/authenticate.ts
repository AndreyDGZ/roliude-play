import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PapelUsuario } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from '../shared/errors/app-error';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: PapelUsuario;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new AppError('Token de acesso não fornecido.', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string };
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return next(new AppError('Usuário não encontrado.', 401));
    }

    res.locals.usuario = user;
    return next();
  } catch {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
};

export const requireRole = (...roles: PapelUsuario[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const usuario = res.locals.usuario as AuthenticatedUser | undefined;

    if (!usuario) {
      return next(new AppError('Não autenticado.', 401));
    }

    if (!roles.includes(usuario.role)) {
      return next(new AppError('Acesso negado. Permissão insuficiente.', 403));
    }

    return next();
  };
};