import { Router } from 'express';
import { PapelUsuario } from '@prisma/client';
import { getDashboardStats } from './dashboard.controller';
import { authenticate, requireRole } from '../../middlewares/authenticate';

export const adminDashboardRoutes = Router();

adminDashboardRoutes.get('/stats', authenticate, requireRole(PapelUsuario.ADMINISTRADOR), getDashboardStats);