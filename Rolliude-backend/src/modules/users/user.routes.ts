import { Router } from 'express';
import { UserController } from './user.controller';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/register', userController.register);

export { userRoutes };
