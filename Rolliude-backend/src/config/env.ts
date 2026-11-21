import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  CORS_ORIGIN: z.string().default(['http:', '', 'localhost:3000'].join('/')),
  FRONTEND_URL: z.string().url().default(['http:', '', 'localhost:3000'].join('/')),
  PORT: z.coerce.number().int().positive().default(3333),
  KAFKA_ENABLED: z.stringbool().default(false),
  KAFKA_BROKERS: z
    .string()
    .default('localhost:9092')
    .transform(brokers => brokers.split(',').map(broker => broker.trim()).filter(Boolean)),
  KAFKA_CLIENT_ID: z.string().min(1).default('rolliude-play-api'),
  KAFKA_TOPIC_RELEASES: z.string().min(1).default('catalogo.lancamentos'),
  OUTBOX_INTERVAL_MS: z.coerce.number().int().positive().default(1500),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter ao menos 32 caracteres.'),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(604800)
});

export const env = envSchema.parse(process.env);
