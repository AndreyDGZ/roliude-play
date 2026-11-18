import { Router } from 'express';
import { adminOnly } from '../../shared/auth/auth.middleware';
import { ReviewController } from './review.controller';

const reviewRoutes = Router();
const reviewModerationRoutes = Router();
const reviewController = new ReviewController();

reviewRoutes.post('/:id/reviews', reviewController.create);

reviewModerationRoutes.get('/', ...adminOnly, reviewController.list);
reviewModerationRoutes.delete('/:id', ...adminOnly, reviewController.remove);

export { reviewModerationRoutes, reviewRoutes };
