import { Request, Response } from 'express';

export const dashboardController = {
  async getStats(req: Request, res: Response) {
    try {
      // Aqui podes consultar a tua base de dados PostgreSQL via Prisma no futuro
      return res.json({
        totalMovies: 124,
        totalUsers: 8405,
        totalViews: '45K',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao carregar dados do dashboard.' });
    }
  },
};