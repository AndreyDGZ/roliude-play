import { z } from 'zod';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../../shared/auth/password';

export const PAPEIS_USUARIO = ['USUARIO', 'ADMIN'] as const;

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(255, 'O e-mail não pode exceder 255 caracteres.')
  .pipe(z.email('E-mail inválido.'));

export const registerSchema = z.object({
  nome: z.string().trim().min(2, 'O nome deve ter ao menos 2 caracteres.').max(80, 'O nome não pode exceder 80 caracteres.'),
  email: emailSchema,
  senha: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `A senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`)
    .max(MAX_PASSWORD_LENGTH, `A senha não pode exceder ${MAX_PASSWORD_LENGTH} caracteres.`)
});

export const loginSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1, 'A senha é obrigatória.').max(MAX_PASSWORD_LENGTH, `A senha não pode exceder ${MAX_PASSWORD_LENGTH} caracteres.`)
});

export const userResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string(),
  papel: z.enum(PAPEIS_USUARIO),
  criadoEm: z.iso.datetime()
});

export const authSessionResponseSchema = z.object({
  token: z.string(),
  usuario: userResponseSchema
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type AuthSessionResponse = z.infer<typeof authSessionResponseSchema>;
