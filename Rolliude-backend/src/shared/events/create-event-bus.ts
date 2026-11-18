import { env } from '../../config/env';
import { EventBus } from './event-bus';
import { InMemoryEventBus } from './in-memory-event-bus';
import { KafkaEventBus } from './kafka-event-bus';

const RELEASE_TOPIC_PARTITIONS = 3;

export function createEventBus(): EventBus {
  if (!env.KAFKA_ENABLED) {
    return new InMemoryEventBus();
  }

  return new KafkaEventBus({
    clientId: env.KAFKA_CLIENT_ID,
    brokers: env.KAFKA_BROKERS,
    topics: [{ name: env.KAFKA_TOPIC_RELEASES, partitions: RELEASE_TOPIC_PARTITIONS }]
  });
}

export const eventBus = createEventBus();
