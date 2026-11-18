import { env } from '../../config/env';
import { EventBus, EventMessage } from '../../shared/events/event-bus';
import { parseReleaseEvent } from '../../shared/events/release-event.schema';
import { NotificationService } from './notification.service';

const PERSISTENCE_GROUP_ID = 'notificacoes-persistencia';

export class ReleasePersistenceConsumer {
  private readonly notificationService = new NotificationService();

  constructor(private readonly eventBus: EventBus) {}

  async start(): Promise<void> {
    await this.eventBus.subscribe({
      topic: env.KAFKA_TOPIC_RELEASES,
      groupId: PERSISTENCE_GROUP_ID,
      fromBeginning: true,
      handler: message => this.persist(message)
    });
  }

  private async persist(message: EventMessage): Promise<void> {
    await this.notificationService.saveRelease(parseReleaseEvent(message.value));
  }
}
