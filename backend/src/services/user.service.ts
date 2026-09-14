import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { RegisterUserInput } from '../schemas/user.schema';

// Custo de processamento do hash recomendado pelas boas práticas de segurança (Seção 24)
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
  /**
   * Executa a regra de negócio para cadastro de um novo usuário.
   * 
   * Diretrizes atendidas:
   * - RF01 / MVP (Seção 21): Registro com e-mail e senha.
   * - Seção 24 (Segurança): 
   *    1. Senhas NUNCA são armazenadas em texto plano (hashing com bcrypt).
   *    2. Unicidade de e-mail com resposta HTTP 409 (Conflict).
   *    3. A senha/hash NUNCA é retornada na resposta para o cliente.
   */
  async register(data: RegisterUserInput): Promise<UserResponseDTO> {
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
      select: { id: true }
    });

    if (existingUser) {
      throw new AppError('O e-mail informado já está em uso.', 409);
    }

    const hashedPassword = await bcrypt.hash(data.senha, BCRYPT_SALT_ROUNDS);

    const novoUsuario = await prisma.usuario.create({
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

    return novoUsuario;
  }
}

