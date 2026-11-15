import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  CORS_ORIGIN: z.string().default(['http:', '', 'localhost:3000'].join('/')),
  FRONTEND_URL: z.string().url().default(['http:', '', 'localhost:3000'].join('/')),
  PORT: z.coerce.number().int().positive().default(3333)
});

export const env = envSchema.parse(process.env);
