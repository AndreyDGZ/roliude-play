import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { signAccessToken } from '../../shared/auth/access-token';
import { AuthenticatedUser, authenticatedUserSelect } from '../../shared/auth/authenticated-user';
import { hashPassword, hashPasswordSync, passwordMatchesHash } from '../../shared/auth/password';
import { AppError } from '../../shared/errors/app-error';
import { toUserResponse } from './auth.mapper';
import { AuthSessionResponse, LoginInput, RegisterInput } from './auth.schema';

const UNIQUE_CONSTRAINT_ERROR = 'P2002';
const INVALID_CREDENTIALS_MESSAGE = 'E-mail ou senha inválidos.';
const UNKNOWN_USER_PASSWORD_HASH = hashPasswordSync('rolliude-usuario-inexistente');

export class AuthService {
  async register(data: RegisterInput): Promise<AuthSessionResponse> {
    const senhaHash = await hashPassword(data.senha);

    try {
      const created = await prisma.usuario.create({
        data: { nome: data.nome, email: data.email, senhaHash },
        select: authenticatedUserSelect
      });

      return this.buildSession(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === UNIQUE_CONSTRAINT_ERROR) {
        throw new AppError('E-mail já cadastrado.', 409);
      }

      throw error;
    }
  }

  async login(data: LoginInput): Promise<AuthSessionResponse> {
    const user = await prisma.usuario.findUnique({
      where: { email: data.email },
      select: { ...authenticatedUserSelect, senhaHash: true }
    });

    const passwordMatches = await passwordMatchesHash(data.senha, user?.senhaHash ?? UNKNOWN_USER_PASSWORD_HASH);

    if (!user || !passwordMatches) {
      throw new AppError(INVALID_CREDENTIALS_MESSAGE, 401);
    }

    return this.buildSession(user);
  }

  private buildSession(user: AuthenticatedUser): AuthSessionResponse {
    return { token: signAccessToken(user.id), usuario: toUserResponse(user) };
  }
}
