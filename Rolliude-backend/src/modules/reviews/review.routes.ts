import { Router } from 'express';
import { ReviewController } from './review.controller';

const reviewRoutes = Router();
const reviewController = new ReviewController();

reviewRoutes.post('/:id/reviews', reviewController.create);

export { reviewRoutes };
