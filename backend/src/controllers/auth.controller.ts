import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthService, AppError } from '../services/auth.service';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.register(validatedData);

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso.',
        data: result
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Erro de validação nos campos fornecidos.',
          errors: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }

      return next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);

      return res.status(200).json({
        message: 'Autenticação realizada com sucesso.',
        data: result
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Erro de validação nos campos fornecidos.',
          errors: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }

      return next(error);
    }
  };
}
