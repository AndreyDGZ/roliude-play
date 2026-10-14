import { NextFunction, Request, Response } from 'express';
import {
  createFilmSchema,
  filmIdParamsSchema,
  listAdminFilmsQuerySchema,
  listFilmsQuerySchema,
  updateFilmSchema
} from './film.schema';
import { FilmService } from './film.service';

export class FilmController {
  private readonly filmService: FilmService;

  constructor() {
    this.filmService = new FilmService();
  }

  list = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listFilmsQuerySchema.parse(request.query);

      return response.json(await this.filmService.listPublished(query));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = filmIdParamsSchema.parse(request.params);

      return response.json({ data: await this.filmService.getPublished(id) });
    } catch (error) {
      return next(error);
    }
  };

  listAdmin = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listAdminFilmsQuerySchema.parse(request.query);

      return response.json(await this.filmService.listAll(query));
    } catch (error) {
      return next(error);
    }
  };

  getByIdAdmin = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = filmIdParamsSchema.parse(request.params);

      return response.json({ data: await this.filmService.getAny(id) });
    } catch (error) {
      return next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = createFilmSchema.parse(request.body);
      const film = await this.filmService.create(data);

      return response.status(201).json({ message: 'Filme cadastrado com sucesso.', data: film });
    } catch (error) {
      return next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = filmIdParamsSchema.parse(request.params);
      const data = updateFilmSchema.parse(request.body);
      const film = await this.filmService.update(id, data);

      return response.json({ message: 'Filme atualizado com sucesso.', data: film });
    } catch (error) {
      return next(error);
    }
  };

  remove = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = filmIdParamsSchema.parse(request.params);
      await this.filmService.remove(id);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
