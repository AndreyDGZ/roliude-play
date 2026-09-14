import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { UserService, AppError } from '../services/user.service';
import { registerUserSchema } from '../schemas/user.schema';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Controlador responsável pelo registro de novos usuários.
   * Valida os campos da requisição, chama o serviço de domínio e responde com status 201 Created.
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // 1. Validação do payload conforme schema rigoroso
      const validatedData = registerUserSchema.parse(req.body);

      // 2. Processamento da regra de negócio
      const user = await this.userService.register(validatedData);

      // 3. Resposta padronizada 201 Created sem dados sensíveis
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

