import type { NextFunction, Request, Response } from 'express';
import type { ZodError } from 'zod';
import {
  idParamSchema,
  listQuerySchema,
  movieBodySchema,
  movieUpdateSchema,
  statusBodySchema,
} from './movie.schema';
import { movieService } from './movie.service';

function sendValidationError(response: Response, error: ZodError) {
  response.status(400).json({ error: 'Dados inválidos', details: error.flatten().fieldErrors });
}

function sendNotFound(response: Response) {
  response.status(404).json({ error: 'Filme não encontrado' });
}

function parseId(request: Request, response: Response): string | null {
  const params = idParamSchema.safeParse(request.params);
  if (!params.success) {
    sendValidationError(response, params.error);
    return null;
  }
  return params.data.id;
}

export const movieController = {
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const query = listQuerySchema.safeParse(request.query);
      if (!query.success) return sendValidationError(response, query.error);
      response.json(await movieService.list(query.data));
    } catch (error) {
      next(error);
    }
  },

  async listGeneros(_request: Request, response: Response, next: NextFunction) {
    try {
      response.json(await movieService.listGeneros());
    } catch (error) {
      next(error);
    }
  },

  async getById(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseId(request, response);
      if (!id) return;
      const filme = await movieService.findById(id);
      if (!filme) return sendNotFound(response);
      response.json(filme);
    } catch (error) {
      next(error);
    }
  },

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const body = movieBodySchema.safeParse(request.body);
      if (!body.success) return sendValidationError(response, body.error);
      response.status(201).json(await movieService.create(body.data));
    } catch (error) {
      next(error);
    }
  },

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseId(request, response);
      if (!id) return;
      const body = movieUpdateSchema.safeParse(request.body);
      if (!body.success) return sendValidationError(response, body.error);
      if (!(await movieService.findById(id))) return sendNotFound(response);
      response.json(await movieService.update(id, body.data));
    } catch (error) {
      next(error);
    }
  },

  async setStatus(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseId(request, response);
      if (!id) return;
      const body = statusBodySchema.safeParse(request.body);
      if (!body.success) return sendValidationError(response, body.error);
      if (!(await movieService.findById(id))) return sendNotFound(response);
      response.json(await movieService.setStatus(id, body.data.status));
    } catch (error) {
      next(error);
    }
  },

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseId(request, response);
      if (!id) return;
      if (!(await movieService.findById(id))) return sendNotFound(response);
      await movieService.remove(id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};
