import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const userRoutes = Router();
const userController = new UserController();

/**
 * @route POST /api/users/register
 * @desc  Cadastra um novo usuário no Rolliúde Play (RF01 - MVP)
 * @access Público
 */
userRoutes.post('/register', userController.register);

export { userRoutes };

