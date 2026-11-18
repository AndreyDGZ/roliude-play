import { EventEmitter } from 'node:events';
import { EventBus, EventMessage, EventSubscription, deliverWithRetry, describeError, writeEventWarning } from './event-bus';

export class InMemoryEventBus implements EventBus {
  private readonly emitter = new EventEmitter();

  async start(): Promise<void> {
    writeEventWarning('KAFKA_ENABLED=false, eventos trafegando em memória.');
  }

  async publish(topic: string, message: EventMessage): Promise<void> {
    setImmediate(() => this.emitter.emit(topic, message));
  }

  async subscribe(subscription: EventSubscription): Promise<void> {
    this.emitter.on(subscription.topic, (message: EventMessage) => {
      void this.deliver(subscription, message);
    });
  }

  async stop(): Promise<void> {
    this.emitter.removeAllListeners();
  }

  private async deliver(subscription: EventSubscription, message: EventMessage): Promise<void> {
    const failure = await deliverWithRetry(subscription.handler, message);

    if (failure === null) {
      return;
    }

    writeEventWarning(`mensagem ${message.key} descartada pelo grupo ${subscription.groupId}: ${describeError(failure)}`);
  }
}
