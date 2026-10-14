import { Router } from 'express';
import { GenreController } from './genre.controller';

const genreRoutes = Router();
const genreController = new GenreController();

genreRoutes.get('/', genreController.list);

export { genreRoutes };
