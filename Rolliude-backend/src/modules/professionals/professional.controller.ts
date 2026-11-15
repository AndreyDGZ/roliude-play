import { NextFunction, Request, Response } from 'express';
import {
  createProfessionalSchema,
  listProfessionalsQuerySchema,
  professionalIdParamsSchema,
  updateProfessionalSchema
} from './professional.schema';
import { ProfessionalService } from './professional.service';

export class ProfessionalController {
  private readonly professionalService: ProfessionalService;

  constructor() {
    this.professionalService = new ProfessionalService();
  }

  list = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listProfessionalsQuerySchema.parse(request.query);

      return response.json(await this.professionalService.list(query));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = professionalIdParamsSchema.parse(request.params);

      return response.json({ data: await this.professionalService.getById(id) });
    } catch (error) {
      return next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = createProfessionalSchema.parse(request.body);
      const professional = await this.professionalService.create(data);

      return response.status(201).json({ message: 'Profissional cadastrado com sucesso.', data: professional });
    } catch (error) {
      return next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = professionalIdParamsSchema.parse(request.params);
      const data = updateProfessionalSchema.parse(request.body);
      const professional = await this.professionalService.update(id, data);

      return response.json({ message: 'Profissional atualizado com sucesso.', data: professional });
    } catch (error) {
      return next(error);
    }
  };

  remove = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = professionalIdParamsSchema.parse(request.params);
      await this.professionalService.remove(id);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
