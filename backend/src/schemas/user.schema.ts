import { z } from 'zod';

/**
 * Schema de validação do payload de cadastro de usuário.
 * 
 * Atende às diretrizes:
 * - Seção 24 (Segurança): Validação rigorosa de entrada em endpoints.
 * - RF01 / Seção 21 (MVP): Cadastro tradicional com nome, e-mail e senha.
 */
export const registerUserSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(255, 'O nome não pode exceder 255 caracteres.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Formato de e-mail inválido.')
    .max(255, 'O e-mail não pode exceder 255 caracteres.'),
  senha: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
    .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula.')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número.')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter ao menos um caractere especial.')
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

