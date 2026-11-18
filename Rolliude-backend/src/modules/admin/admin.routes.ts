import { Router } from 'express';
import { adminOnly } from '../../shared/auth/auth.middleware';
import { AdminController } from './admin.controller';

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.use(...adminOnly);
adminRoutes.get('/overview', adminController.getOverview);
adminRoutes.get('/users', adminController.listUsers);
adminRoutes.patch('/users/:id/role', adminController.updateUserRole);

export { adminRoutes };
