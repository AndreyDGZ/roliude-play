import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { UserService, AppError } from '../services/user.service';
import { registerUserSchema } from '../schemas/user.schema';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      const user = await this.userService.register(validatedData);

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso.',
        data: user
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
