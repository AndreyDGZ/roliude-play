import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { RegisterUserInput } from '../schemas/user.schema';

const BCRYPT_SALT_ROUNDS = 12;

export interface UserResponseDTO {
  id: string;
  nome: string;
  email: string;
  createdAt: Date;
}

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UserService {
  async register(data: RegisterUserInput): Promise<UserResponseDTO> {
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
      select: { id: true }
    });

    if (existingUser) {
      throw new AppError('O e-mail informado já está em uso.', 409);
    }

    const hashedPassword = await bcrypt.hash(data.senha, BCRYPT_SALT_ROUNDS);

    const createdUser = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true
      }
    });

    return createdUser;
  }
}
