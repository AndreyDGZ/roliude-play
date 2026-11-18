import { Notificacao } from '@prisma/client';
import { ReleaseEvent, releaseEventSchema } from '../../shared/events/release-event.schema';
import { NotificationResponse } from './notification.schema';

export function toNotificationFromEvent(event: ReleaseEvent, createdAt: Date, lida: boolean): NotificationResponse {
  return {
    id: event.eventId,
    filmeId: event.data.filmeId,
    titulo: event.data.titulo,
    genero: event.data.genero,
    municipio: event.data.municipio,
    estadoSigla: event.data.estadoSigla,
    classificacaoIndicativa: event.data.classificacaoIndicativa,
    posterUrl: event.data.posterUrl,
    createdAt: createdAt.toISOString(),
    lida
  };
}

export function toNotificationResponse(record: Notificacao, lida: boolean): NotificationResponse {
  const event = releaseEventSchema.parse(record.payload);

  return { ...toNotificationFromEvent(event, record.createdAt, lida), id: record.id };
}
