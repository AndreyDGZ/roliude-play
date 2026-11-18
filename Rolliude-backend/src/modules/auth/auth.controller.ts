import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../shared/errors/app-error';
import { toUserResponse } from './auth.mapper';
import { loginSchema, registerSchema } from './auth.schema';
import { AuthService } from './auth.service';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = registerSchema.parse(request.body);
      const session = await this.authService.register(data);

      return response.status(201).json({ message: 'Conta criada com sucesso.', data: session });
    } catch (error) {
      return next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = loginSchema.parse(request.body);

      return response.json({ data: await this.authService.login(data) });
    } catch (error) {
      return next(error);
    }
  };

  me = (request: Request, response: Response, next: NextFunction): Response | void => {
    if (!request.user) {
      return next(new AppError('Autenticação necessária.', 401));
    }

    return response.json({ data: toUserResponse(request.user) });
  };
}
