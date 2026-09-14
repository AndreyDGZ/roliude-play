import { PrismaClient } from '@prisma/client';

/**
 * Instância singleton do PrismaClient para conexão com o banco PostgreSQL.
 * Atende às diretrizes de arquitetura em camadas e persistência da documentação.
 */
export const prisma = new PrismaClient();

