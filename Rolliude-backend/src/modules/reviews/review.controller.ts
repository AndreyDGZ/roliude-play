import { NextFunction, Request, Response } from 'express';
import { createReviewSchema, movieIdParamsSchema } from './review.schema';
import { ReviewService } from './review.service';

export class ReviewController {
  private readonly reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  create = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = movieIdParamsSchema.parse(request.params);
      const data = createReviewSchema.parse(request.body);
      const movie = await this.reviewService.create(id, data);

      return response.status(201).json({ message: 'Avaliação registrada com sucesso.', data: movie });
    } catch (error) {
      return next(error);
    }
  };
}
