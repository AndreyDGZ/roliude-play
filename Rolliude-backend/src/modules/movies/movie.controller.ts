import { NextFunction, Request, Response } from 'express';
import { createMovieSchema, listMoviesQuerySchema, movieIdParamsSchema, updateMovieSchema } from './movie.schema';
import { MovieService } from './movie.service';

export class MovieController {
  private readonly movieService: MovieService;

  constructor() {
    this.movieService = new MovieService();
  }

  list = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listMoviesQuerySchema.parse(request.query);

      return response.json(await this.movieService.list(query));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = movieIdParamsSchema.parse(request.params);

      return response.json({ data: await this.movieService.getById(id) });
    } catch (error) {
      return next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = createMovieSchema.parse(request.body);
      const movie = await this.movieService.create(data);

      return response.status(201).json({ message: 'Filme cadastrado com sucesso.', data: movie });
    } catch (error) {
      return next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = movieIdParamsSchema.parse(request.params);
      const data = updateMovieSchema.parse(request.body);
      const movie = await this.movieService.update(id, data);

      return response.json({ message: 'Filme atualizado com sucesso.', data: movie });
    } catch (error) {
      return next(error);
    }
  };

  remove = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = movieIdParamsSchema.parse(request.params);
      await this.movieService.remove(id);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
