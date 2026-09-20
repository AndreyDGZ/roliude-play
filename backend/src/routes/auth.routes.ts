import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { forgotPasswordLimiter, resetPasswordLimiter } from '../middlewares/rate-limit';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/password/forgot', forgotPasswordLimiter, authController.forgotPassword);
authRoutes.get('/password/validate-token', resetPasswordLimiter, authController.validatePasswordResetToken);
authRoutes.post('/password/reset', resetPasswordLimiter, authController.resetPassword);

export { authRoutes };
