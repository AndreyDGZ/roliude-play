import { NextFunction, Request, Response } from 'express';
import { btsIdParamsSchema, createBtsItemSchema, listBtsQuerySchema, updateBtsItemSchema } from './bts.schema';
import { BtsService } from './bts.service';

export class BtsController {
  private readonly btsService: BtsService;

  constructor() {
    this.btsService = new BtsService();
  }

  list = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listBtsQuerySchema.parse(request.query);

      return response.json({ data: await this.btsService.list(query) });
    } catch (error) {
      return next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = btsIdParamsSchema.parse(request.params);

      return response.json({ data: await this.btsService.getById(id) });
    } catch (error) {
      return next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = createBtsItemSchema.parse(request.body);
      const item = await this.btsService.create(data);

      return response.status(201).json({ message: 'Conteúdo de bastidores cadastrado com sucesso.', data: item });
    } catch (error) {
      return next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = btsIdParamsSchema.parse(request.params);
      const data = updateBtsItemSchema.parse(request.body);
      const item = await this.btsService.update(id, data);

      return response.json({ message: 'Conteúdo de bastidores atualizado com sucesso.', data: item });
    } catch (error) {
      return next(error);
    }
  };

  remove = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = btsIdParamsSchema.parse(request.params);
      await this.btsService.remove(id);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
