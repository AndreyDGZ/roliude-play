import { z } from 'zod';

export const NOTIFICATIONS_WINDOW_DAYS = 30;
export const MISSED_NOTIFICATIONS_LIMIT = 20;
const DEFAULT_NOTIFICATIONS_LIMIT = 20;
const MAX_NOTIFICATIONS_LIMIT = 50;

const deviceIdSchema = z.uuid('Identificador de dispositivo inválido.');

export const listNotificationsQuerySchema = z.object({
  dispositivoId: deviceIdSchema,
  limite: z.coerce
    .number()
    .int()
    .min(1, 'O limite deve ser no mínimo 1.')
    .max(MAX_NOTIFICATIONS_LIMIT, `O limite deve ser no máximo ${MAX_NOTIFICATIONS_LIMIT}.`)
    .default(DEFAULT_NOTIFICATIONS_LIMIT)
});

export const notificationIdParamsSchema = z.object({
  id: z.uuid('Identificador de notificação inválido.')
});

export const notificationDeviceBodySchema = z.object({
  dispositivoId: deviceIdSchema
});

export const notificationResponseSchema = z.object({
  id: z.string(),
  filmeId: z.string(),
  titulo: z.string(),
  genero: z.array(z.string()),
  municipio: z.string(),
  estadoSigla: z.string(),
  classificacaoIndicativa: z.string(),
  posterUrl: z.string(),
  createdAt: z.iso.datetime(),
  lida: z.boolean()
});

export const notificationListResponseSchema = z.object({
  data: z.array(notificationResponseSchema),
  meta: z.object({ naoLidas: z.number().int() })
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;
export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;
