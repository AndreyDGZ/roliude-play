import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface para o payload do Token JWT
export interface TokenPayload {
  id: string;
  email: string;
  role: string; // Ex: 'ADMIN' ou 'USER'
}

// Extende a interface Request do Express para incluir o campo 'user'
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// 1. Middleware que valida se o Token JWT enviado é válido
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

// 2. Middleware que confirma se o usuário logado possui privilégios de Administrador
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      message: 'Acesso negado. Privilégios de administrador necessários.' 
    });
  }

  next();
};