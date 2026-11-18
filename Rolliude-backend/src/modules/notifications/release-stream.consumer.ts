import { hostname } from 'node:os';
import { env } from '../../config/env';
import { EventBus, EventMessage } from '../../shared/events/event-bus';
import { parseReleaseEvent } from '../../shared/events/release-event.schema';
import { toNotificationFromEvent } from './notification.mapper';
import { sseHub } from './sse-hub';

const STREAM_GROUP_PREFIX = 'notificacoes-sse';

export class ReleaseStreamConsumer {
  constructor(private readonly eventBus: EventBus) {}

  async start(): Promise<void> {
    await this.eventBus.subscribe({
      topic: env.KAFKA_TOPIC_RELEASES,
      groupId: `${STREAM_GROUP_PREFIX}-${hostname()}`,
      fromBeginning: false,
      handler: message => this.broadcast(message)
    });
  }

  private async broadcast(message: EventMessage): Promise<void> {
    const event = parseReleaseEvent(message.value);
    sseHub.broadcast(toNotificationFromEvent(event, new Date(event.occurredAt), false));
  }
}
