import { Router } from 'express';
import { PapelUsuario } from '@prisma/client';
import { authenticate, requireRole } from '../../middlewares/authenticate';
import { FilmController } from './film.controller';

const filmController = new FilmController();

const filmRoutes = Router();

filmRoutes.get('/', filmController.list);
filmRoutes.get('/:id', filmController.getById);

const filmAdminRoutes = Router();

filmAdminRoutes.use(authenticate, requireRole(PapelUsuario.ADMIN));
filmAdminRoutes.get('/', filmController.listAdmin);
filmAdminRoutes.get('/:id', filmController.getByIdAdmin);
filmAdminRoutes.post('/', filmController.create);
filmAdminRoutes.patch('/:id', filmController.update);
filmAdminRoutes.delete('/:id', filmController.remove);

export { filmAdminRoutes, filmRoutes };