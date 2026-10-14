import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/require-admin';
import { movieController } from './movie.controller';

export const adminMovieRoutes = Router();

adminMovieRoutes.use(requireAdmin);
adminMovieRoutes.get('/', movieController.list);
adminMovieRoutes.get('/generos', movieController.listGeneros);
adminMovieRoutes.get('/:id', movieController.getById);
adminMovieRoutes.post('/', movieController.create);
adminMovieRoutes.put('/:id', movieController.update);
adminMovieRoutes.patch('/:id/status', movieController.setStatus);
adminMovieRoutes.delete('/:id', movieController.remove);
