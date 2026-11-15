import { Router } from 'express';
import { MovieController } from './movie.controller';

const movieRoutes = Router();
const movieController = new MovieController();

movieRoutes.get('/', movieController.list);
movieRoutes.get('/:id', movieController.getById);
movieRoutes.post('/', movieController.create);
movieRoutes.patch('/:id', movieController.update);
movieRoutes.delete('/:id', movieController.remove);

export { movieRoutes };
