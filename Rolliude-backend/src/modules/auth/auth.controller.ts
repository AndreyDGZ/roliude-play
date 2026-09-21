import { NextFunction, Request, Response } from 'express';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, validatePasswordResetTokenSchema } from './auth.schema';
import { AuthService } from './auth.service';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = registerSchema.parse(request.body);
      const result = await this.authService.register(validatedData);

      return response.status(201).json({
        message: 'Usuário cadastrado com sucesso.',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = loginSchema.parse(request.body);
      const result = await this.authService.login(validatedData);

      return response.status(200).json({
        message: 'Autenticação realizada com sucesso.',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };

  forgotPassword = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = forgotPasswordSchema.parse(request.body);
      await this.authService.forgotPassword(validatedData);

      return response.status(200).json({
        message: 'Se houver uma conta associada a este e-mail, enviaremos um link para redefinir a senha.'
      });
    } catch (error) {
      return next(error);
    }
  };

  validatePasswordResetToken = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = validatePasswordResetTokenSchema.parse(request.query);
      const result = await this.authService.validatePasswordResetToken(validatedData);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  };

  resetPassword = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = resetPasswordSchema.parse(request.body);
      await this.authService.resetPassword(validatedData);

      return response.status(200).json({
        message: 'Senha redefinida com sucesso.'
      });
    } catch (error) {
      return next(error);
    }
  };
}
