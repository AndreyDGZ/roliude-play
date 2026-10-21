import { Router } from 'express';
import { PapelUsuario } from '@prisma/client';
import { authenticate, requireRole } from '../../middlewares/authenticate';
import { MovieController } from './movie.controller';

const movieController = new MovieController();

const publicMovieRoutes = Router();
const adminMovieRoutes = Router();

publicMovieRoutes.get('/', movieController.list);
publicMovieRoutes.get('/:id', movieController.getById);
publicMovieRoutes.get('/:id/stream', movieController.stream);

adminMovieRoutes.use(authenticate, requireRole(PapelUsuario.ADMIN));
adminMovieRoutes.post('/', movieController.create);
adminMovieRoutes.patch('/:id', movieController.update);
adminMovieRoutes.patch('/:id/publicado', movieController.togglePublicado);

export { publicMovieRoutes, adminMovieRoutes };