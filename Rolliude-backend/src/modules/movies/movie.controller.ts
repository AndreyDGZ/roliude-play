import { Request, Response, NextFunction } from 'express';
import {
  movieBodySchema,
  movieUpdateSchema,
  idParamsSchema,
  listQuerySchema,
  publicadoBodySchema
} from './movie.schema';
import { MovieService } from './movie.service';

const movieService = new MovieService();

export class MovieController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listQuerySchema.parse(req.query);
      const movies = await movieService.findAll(query);
      res.json({ data: movies });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const movie = await movieService.findById(id);

      if (!movie) {
        res.status(404).json({ message: 'Filme não encontrado.' });
        return;
      }

      res.json({ data: movie });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = movieBodySchema.parse(req.body);
      const movie = await movieService.create(body);
      res.status(201).json({ data: movie });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const body = movieUpdateSchema.parse(req.body);
      const movie = await movieService.update(id, body);
      res.json({ data: movie });
    } catch (error) {
      next(error);
    }
  }

  async togglePublicado(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const { publicado } = publicadoBodySchema.parse(req.body);
      const movie = await movieService.togglePublicado(id, publicado);
      res.json({ data: movie });
    } catch (error) {
      next(error);
    }
  }

  async stream(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const filePath = await movieService.getStreamFilePath(id);

      if (!filePath) {
        res.status(404).json({ message: 'Vídeo não encontrado ou indisponível.' });
        return;
      }

      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }
}