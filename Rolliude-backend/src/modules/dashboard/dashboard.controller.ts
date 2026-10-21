import { Request, Response, NextFunction } from 'express';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      totalFilmes: 0,
      totalUsuarios: 0,
      avaliacoes: 0,
    });
  } catch (error) {
    next(error);
  }
};