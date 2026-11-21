import { Router } from 'express';
import { authenticate } from '../../shared/auth/auth.middleware';
import { AuthController } from './auth.controller';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.get('/me', authenticate, authController.me);

export { authRoutes };
