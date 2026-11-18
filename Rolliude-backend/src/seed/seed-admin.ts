import dotenv from 'dotenv';
import { prisma } from '../config/prisma';
import { seedAdmin } from './admin-seed';

dotenv.config();

seedAdmin()
  .catch(error => {
    process.stderr.write(`Falha ao criar o administrador: ${error instanceof Error ? error.message : 'erro desconhecido'}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
