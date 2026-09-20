import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, ValidatePasswordResetTokenInput } from '../schemas/auth.schema';
import { AppError, UserResponseDTO, UserService } from './user.service';
import { sendPasswordResetEmail } from './email.service';
import { generatePasswordResetToken, hashPasswordResetToken } from '../utils/reset-token';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_me';
const DEFAULT_JWT_EXPIRES_IN: SignOptions['expiresIn'] = '1d';
const DEFAULT_FRONTEND_URL = 'http://localhost:5173';
const DEFAULT_PASSWORD_RESET_EXPIRES_MINUTES = 30;

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}

export interface PasswordResetTokenValidationDTO {
  valido: boolean;
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

  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    const user = await prisma.usuario.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true
      }
    });

    if (!user) {
      return;
    }

    await this.invalidateActivePasswordResetTokens(user.id);

    const rawToken = generatePasswordResetToken();
    const tokenHash = hashPasswordResetToken(rawToken);
    const expiresInMinutes = this.getPasswordResetExpiresMinutes();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        usuarioId: user.id,
        tokenHash,
        expiresAt
      }
    });

    await sendPasswordResetEmail({
      email: user.email,
      resetLink: `${this.getFrontendUrl()}/redefinir-senha/${rawToken}`,
      expiresInMinutes
    });
  }

  async validatePasswordResetToken(data: ValidatePasswordResetTokenInput): Promise<PasswordResetTokenValidationDTO> {
    const tokenHash = hashPasswordResetToken(data.token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash }
    });

    return {
      valido: Boolean(resetToken && !resetToken.usedAt && resetToken.expiresAt >= new Date())
    };
  }

  async resetPassword(data: ResetPasswordInput): Promise<void> {
    const tokenHash = hashPasswordResetToken(data.token);

    await prisma.$transaction(async transaction => {
      const resetToken = await transaction.passwordResetToken.findUnique({
        where: { tokenHash }
      });

      if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
        throw new AppError('Token inválido ou expirado.', 400);
      }

      const hashedPassword = await bcrypt.hash(data.novaSenha, 12);

      await transaction.usuario.update({
        where: { id: resetToken.usuarioId },
        data: { senha: hashedPassword }
      });

      const usedAt = new Date();

      await transaction.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt }
      });

      await transaction.passwordResetToken.updateMany({
        where: {
          usuarioId: resetToken.usuarioId,
          usedAt: null
        },
        data: { usedAt }
      });
    });
  }

  private async invalidateActivePasswordResetTokens(userId: string): Promise<void> {
    await prisma.passwordResetToken.updateMany({
      where: {
        usuarioId: userId,
        usedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      data: {
        usedAt: new Date()
      }
    });
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

  private getFrontendUrl(): string {
    return process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;
  }

  private getPasswordResetExpiresMinutes(): number {
    const configuredMinutes = Number(process.env.PASSWORD_RESET_TOKEN_EXPIRES_MIN);

    if (Number.isInteger(configuredMinutes) && configuredMinutes > 0) {
      return configuredMinutes;
    }

    return DEFAULT_PASSWORD_RESET_EXPIRES_MINUTES;
  }
}

export { AppError };
