import { PapelUsuario } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { hashPassword, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../shared/auth/password';

const adminSeedEnvSchema = z.object({
  ADMIN_NOME: z.string().trim().min(2).default('Administrador Rolliúde'),
  ADMIN_EMAIL: z.string().trim().toLowerCase().pipe(z.email('ADMIN_EMAIL inválido.')),
  ADMIN_PASSWORD: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `ADMIN_PASSWORD deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`)
    .max(MAX_PASSWORD_LENGTH, `ADMIN_PASSWORD não pode exceder ${MAX_PASSWORD_LENGTH} caracteres.`)
});

export async function seedAdmin(): Promise<void> {
  const parsed = adminSeedEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Configure ADMIN_EMAIL e ADMIN_PASSWORD no .env: ${parsed.error.issues.map(issue => issue.message).join(' ')}`);
  }

  const senhaHash = await hashPassword(parsed.data.ADMIN_PASSWORD);

  await prisma.usuario.upsert({
    where: { email: parsed.data.ADMIN_EMAIL },
    update: { nome: parsed.data.ADMIN_NOME, senhaHash, papel: PapelUsuario.ADMIN },
    create: { nome: parsed.data.ADMIN_NOME, email: parsed.data.ADMIN_EMAIL, senhaHash, papel: PapelUsuario.ADMIN }
  });

  process.stdout.write(`Administrador ${parsed.data.ADMIN_EMAIL} pronto.\n`);
}
