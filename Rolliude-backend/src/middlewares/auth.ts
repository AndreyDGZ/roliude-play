import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, () => {
    if (req.user?.role?.toUpperCase() !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }
    next();
  });
};