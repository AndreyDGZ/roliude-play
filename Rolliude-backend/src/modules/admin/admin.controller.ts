import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../shared/errors/app-error';
import { listUsersQuerySchema, updateUserRoleSchema, userIdParamsSchema } from './admin.schema';
import { AdminService } from './admin.service';

export class AdminController {
  private readonly adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getOverview = async (_request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      return response.json({ data: await this.adminService.getOverview() });
    } catch (error) {
      return next(error);
    }
  };

  listUsers = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listUsersQuerySchema.parse(request.query);

      return response.json(await this.adminService.listUsers(query));
    } catch (error) {
      return next(error);
    }
  };

  updateUserRole = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!request.user) {
        throw new AppError('Autenticação necessária.', 401);
      }

      const { id } = userIdParamsSchema.parse(request.params);
      const data = updateUserRoleSchema.parse(request.body);
      const user = await this.adminService.updateUserRole(request.user.id, id, data);

      return response.json({ message: 'Papel atualizado com sucesso.', data: user });
    } catch (error) {
      return next(error);
    }
  };
}
