import { NextFunction, Request, Response } from 'express';
import { registerUserSchema } from './user.schema';
import { UserService } from './user.service';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const validatedData = registerUserSchema.parse(request.body);
      const user = await this.userService.register(validatedData);

      return response.status(201).json({
        message: 'Usuário cadastrado com sucesso.',
        data: user
      });
    } catch (error) {
      return next(error);
    }
  };
}
