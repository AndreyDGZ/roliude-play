import { z } from 'zod';

export const RELEASE_EVENT_TYPE = 'catalogo.filme.lancado';
export const RELEASE_EVENT_VERSION = 1;

export const releaseEventDataSchema = z.object({
  filmeId: z.string().min(1),
  titulo: z.string().min(1),
  genero: z.array(z.string()),
  municipio: z.string(),
  estadoSigla: z.string(),
  classificacaoIndicativa: z.string(),
  posterUrl: z.string()
});

export const releaseEventSchema = z.object({
  eventId: z.uuid(),
  eventType: z.literal(RELEASE_EVENT_TYPE),
  version: z.literal(RELEASE_EVENT_VERSION),
  occurredAt: z.iso.datetime(),
  data: releaseEventDataSchema
});

export type ReleaseEventData = z.infer<typeof releaseEventDataSchema>;
export type ReleaseEvent = z.infer<typeof releaseEventSchema>;

export function parseReleaseEvent(rawValue: string): ReleaseEvent {
  return releaseEventSchema.parse(JSON.parse(rawValue));
}
