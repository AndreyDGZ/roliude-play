import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/require-admin';
import { dashboardController } from './dashboard.controller';

export const adminDashboardRoutes = Router();

// Protege todas as rotas do dashboard com o middleware de Admin existente
adminDashboardRoutes.use(requireAdmin);

// Rota GET /admin/dashboard/stats
adminDashboardRoutes.get('/stats', dashboardController.getStats);