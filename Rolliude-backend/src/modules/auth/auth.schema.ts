import { z } from 'zod';

export const registerSchema = z.object({
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

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Formato de e-mail inválido.'),
  senha: z
    .string()
    .min(1, 'A senha é obrigatória.')
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Formato de e-mail inválido.')
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .length(64, 'Token inválido.'),
  novaSenha: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
    .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula.')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número.')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter ao menos um caractere especial.')
});

export const validatePasswordResetTokenSchema = z.object({
  token: z
    .string()
    .length(64, 'Token inválido.')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ValidatePasswordResetTokenInput = z.infer<typeof validatePasswordResetTokenSchema>;
