import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  CORS_ORIGIN: z.string().default(['http:', '', 'localhost:5173'].join('/')),
  FRONTEND_URL: z.string().url().default(['http:', '', 'localhost:5173'].join('/')),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres.'),
  PASSWORD_RESET_TOKEN_EXPIRES_MIN: z.coerce.number().int().positive().default(30),
  PORT: z.coerce.number().int().positive().default(3000)
});

export const env = envSchema.parse(process.env);
