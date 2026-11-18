import { Router } from 'express';
import { adminOnly } from '../../shared/auth/auth.middleware';
import { MovieController } from './movie.controller';

const movieRoutes = Router();
const movieController = new MovieController();

movieRoutes.get('/', movieController.list);
movieRoutes.get('/:id', movieController.getById);
movieRoutes.post('/', ...adminOnly, movieController.create);
movieRoutes.patch('/:id', ...adminOnly, movieController.update);
movieRoutes.delete('/:id', ...adminOnly, movieController.remove);

export { movieRoutes };
