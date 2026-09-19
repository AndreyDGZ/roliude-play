import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import { AppError, UserResponseDTO, UserService } from './user.service';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_me';
const DEFAULT_JWT_EXPIRES_IN: SignOptions['expiresIn'] = '1d';

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}

export class AuthService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(data: RegisterInput): Promise<AuthResponseDTO> {
    const createdUser = await this.userService.register(data);
    const token = this.generateToken(createdUser.id, createdUser.email);

    return {
      user: createdUser,
      token
    };
  }

  async login(data: LoginInput): Promise<AuthResponseDTO> {
    const user = await prisma.usuario.findUnique({
      where: { email: data.email }
    });

    if (!user || !user.senha) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.senha, user.senha);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    };
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { sub: userId, email },
      JWT_SECRET,
      { expiresIn: this.getJwtExpiresIn() }
    );
  }

  private getJwtExpiresIn(): SignOptions['expiresIn'] {
    const configuredExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!configuredExpiresIn) {
      return DEFAULT_JWT_EXPIRES_IN;
    }

    const numericExpiresIn = Number(configuredExpiresIn);

    if (Number.isInteger(numericExpiresIn) && numericExpiresIn > 0) {
      return numericExpiresIn;
    }

    return configuredExpiresIn as SignOptions['expiresIn'];
  }
}

export { AppError };
