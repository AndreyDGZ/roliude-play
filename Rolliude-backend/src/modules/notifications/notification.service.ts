import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/errors/app-error';
import { ReleaseEvent } from '../../shared/events/release-event.schema';
import { toNotificationResponse } from './notification.mapper';
import {
  ListNotificationsQuery,
  MISSED_NOTIFICATIONS_LIMIT,
  NOTIFICATIONS_WINDOW_DAYS,
  NotificationListResponse,
  NotificationResponse
} from './notification.schema';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function windowStart(): Date {
  return new Date(Date.now() - NOTIFICATIONS_WINDOW_DAYS * DAY_IN_MS);
}

export class NotificationService {
  async listForDevice(query: ListNotificationsQuery): Promise<NotificationListResponse> {
    const recentFilter = { createdAt: { gte: windowStart() } };

    const [records, naoLidas] = await prisma.$transaction([
      prisma.notificacao.findMany({
        where: recentFilter,
        orderBy: { createdAt: 'desc' },
        take: query.limite,
        include: { leituras: { where: { dispositivoId: query.dispositivoId }, select: { dispositivoId: true } } }
      }),
      prisma.notificacao.count({
        where: { ...recentFilter, leituras: { none: { dispositivoId: query.dispositivoId } } }
      })
    ]);

    return {
      data: records.map(record => toNotificationResponse(record, record.leituras.length > 0)),
      meta: { naoLidas }
    };
  }

  async markAsRead(notificationId: string, dispositivoId: string): Promise<void> {
    const notification = await prisma.notificacao.findUnique({ where: { id: notificationId }, select: { id: true } });

    if (!notification) {
      throw new AppError('Notificação não encontrada.', 404);
    }

    await prisma.notificacaoLeitura.upsert({
      where: { notificacaoId_dispositivoId: { notificacaoId: notificationId, dispositivoId } },
      create: { notificacaoId: notificationId, dispositivoId },
      update: {}
    });
  }

  async markAllAsRead(dispositivoId: string): Promise<void> {
    const unread = await prisma.notificacao.findMany({
      where: { createdAt: { gte: windowStart() }, leituras: { none: { dispositivoId } } },
      select: { id: true }
    });

    await prisma.notificacaoLeitura.createMany({
      data: unread.map(notification => ({ notificacaoId: notification.id, dispositivoId })),
      skipDuplicates: true
    });
  }

  async listAfterEvent(lastEventId: string): Promise<NotificationResponse[]> {
    const lastSeen = await prisma.notificacao.findUnique({ where: { eventId: lastEventId }, select: { createdAt: true } });

    if (!lastSeen) {
      return [];
    }

    const records = await prisma.notificacao.findMany({
      where: { createdAt: { gt: lastSeen.createdAt } },
      orderBy: { createdAt: 'asc' },
      take: MISSED_NOTIFICATIONS_LIMIT
    });

    return records.map(record => toNotificationResponse(record, false));
  }

  async saveRelease(event: ReleaseEvent): Promise<void> {
    await prisma.notificacao.createMany({
      data: [
        {
          id: event.eventId,
          eventId: event.eventId,
          tipoEvento: event.eventType,
          filmeId: event.data.filmeId,
          titulo: event.data.titulo,
          payload: event,
          createdAt: new Date(event.occurredAt)
        }
      ],
      skipDuplicates: true
    });
  }
}
