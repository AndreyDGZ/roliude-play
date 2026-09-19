import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/register', userController.register);

export { userRoutes };
