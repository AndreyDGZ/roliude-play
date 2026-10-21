import { Router } from 'express';
import { getDashboardStats } from './dashboard.controller';
import { requireAdmin } from '../../middlewares/auth';

export const adminDashboardRoutes = Router();

adminDashboardRoutes.get('/stats', requireAdmin, getDashboardStats);