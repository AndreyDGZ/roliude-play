import { NextFunction, Request, Response } from 'express';
import { GenreService } from './genre.service';

export class GenreController {
  private readonly genreService: GenreService;

  constructor() {
    this.genreService = new GenreService();
  }

  list = async (_request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      return response.json({ data: await this.genreService.list() });
    } catch (error) {
      return next(error);
    }
  };
}
