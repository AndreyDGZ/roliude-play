import { app } from './app';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { OutboxRelay } from '../modules/notifications/outbox-relay';
import { ReleasePersistenceConsumer } from '../modules/notifications/release-persistence.consumer';
import { ReleaseStreamConsumer } from '../modules/notifications/release-stream.consumer';
import { sseHub } from '../modules/notifications/sse-hub';
import { eventBus } from '../shared/events/create-event-bus';

const outboxRelay = new OutboxRelay(eventBus, env.OUTBOX_INTERVAL_MS);

async function startNotificationPipeline(): Promise<void> {
  await new ReleasePersistenceConsumer(eventBus).start();
  await new ReleaseStreamConsumer(eventBus).start();
  await eventBus.start();
  sseHub.start();
  outboxRelay.start();
}

const server = app.listen(env.PORT, () => {
  const localUrl = ['http:', '', `localhost:${env.PORT}`].join('/');
  process.stdout.write(`Backend running on ${localUrl}
`);
  void startNotificationPipeline();
});

async function shutdown(): Promise<void> {
  outboxRelay.stop();
  sseHub.close();
  await eventBus.stop();
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.once('SIGTERM', () => void shutdown());
process.once('SIGINT', () => void shutdown());
