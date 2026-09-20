import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthService, AppError } from '../services/auth.service';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, validatePasswordResetTokenSchema } from '../schemas/auth.schema';

interface ValidationErrorResponse {
  field: string;
  message: string;
}

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
      return this.handleError(error, res, next);
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
      return this.handleError(error, res, next);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      await this.authService.forgotPassword(validatedData);

      return res.status(200).json({
        message: 'Se houver uma conta associada a este e-mail, enviaremos um link para redefinir a senha.'
      });
    } catch (error) {
      return this.handleError(error, res, next);
    }
  };

  validatePasswordResetToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = validatePasswordResetTokenSchema.parse(req.query);
      const result = await this.authService.validatePasswordResetToken(validatedData);

      return res.status(200).json(result);
    } catch (error) {
      return this.handleError(error, res, next);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      await this.authService.resetPassword(validatedData);

      return res.status(200).json({
        message: 'Senha redefinida com sucesso.'
      });
    } catch (error) {
      return this.handleError(error, res, next);
    }
  };

  private handleError(error: unknown, res: Response, next: NextFunction): Response | void {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação nos campos fornecidos.',
        errors: this.mapValidationErrors(error)
      });
    }

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    return next(error);
  }

  private mapValidationErrors(error: ZodError): ValidationErrorResponse[] {
    return error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
  }
}
