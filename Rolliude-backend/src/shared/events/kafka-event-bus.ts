import { Admin, Consumer, Kafka, logLevel, Producer } from 'kafkajs';
import { EventBus, EventMessage, EventSubscription, deliverWithRetry, describeError, writeEventWarning } from './event-bus';

const RECONNECT_DELAY_MS = 10000;
const DEAD_LETTER_SUFFIX = '.dlq';

export interface KafkaTopicConfig {
  name: string;
  partitions: number;
}

export interface KafkaEventBusOptions {
  clientId: string;
  brokers: string[];
  topics: KafkaTopicConfig[];
}

export class KafkaEventBus implements EventBus {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly admin: Admin;
  private readonly consumers: Consumer[] = [];
  private readonly pendingSubscriptions: EventSubscription[] = [];
  private connected = false;
  private stopped = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(private readonly options: KafkaEventBusOptions) {
    this.kafka = new Kafka({
      clientId: options.clientId,
      brokers: options.brokers,
      logLevel: logLevel.NOTHING,
      retry: { initialRetryTime: 300, retries: 5 }
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async start(): Promise<void> {
    try {
      await this.connect();
    } catch (error) {
      writeEventWarning(`Kafka indisponível (${describeError(error)}). Nova tentativa em ${RECONNECT_DELAY_MS / 1000}s.`);
      this.scheduleReconnect();
    }
  }

  async publish(topic: string, message: EventMessage): Promise<void> {
    if (!this.connected) {
      throw new Error('Kafka ainda não conectado.');
    }

    await this.producer.send({ topic, messages: [message] });
  }

  async subscribe(subscription: EventSubscription): Promise<void> {
    if (!this.connected) {
      this.pendingSubscriptions.push(subscription);
      return;
    }

    await this.runConsumer(subscription);
  }

  async stop(): Promise<void> {
    this.stopped = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    await Promise.allSettled(this.consumers.map(consumer => consumer.disconnect()));
    await Promise.allSettled([this.producer.disconnect(), this.admin.disconnect()]);
  }

  private async connect(): Promise<void> {
    await this.admin.connect();
    await this.ensureTopics();
    await this.producer.connect();
    this.connected = true;

    const subscriptions = this.pendingSubscriptions.splice(0);
    await Promise.all(subscriptions.map(subscription => this.runConsumer(subscription)));
  }

  private scheduleReconnect(): void {
    if (this.stopped) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      void this.start();
    }, RECONNECT_DELAY_MS);
  }

  private async ensureTopics(): Promise<void> {
    const mainTopics = this.options.topics.map(topic => ({ topic: topic.name, numPartitions: topic.partitions }));
    const deadLetterTopics = this.options.topics.map(topic => ({
      topic: `${topic.name}${DEAD_LETTER_SUFFIX}`,
      numPartitions: 1
    }));

    await this.admin.createTopics({ topics: [...mainTopics, ...deadLetterTopics], waitForLeaders: true });
  }

  private async runConsumer(subscription: EventSubscription): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: subscription.groupId });
    this.consumers.push(consumer);

    await consumer.connect();
    await consumer.subscribe({ topic: subscription.topic, fromBeginning: subscription.fromBeginning });
    await consumer.run({
      eachMessage: async ({ message }) => {
        await this.deliver(subscription, {
          key: message.key?.toString() ?? '',
          value: message.value?.toString() ?? ''
        });
      }
    });
  }

  private async deliver(subscription: EventSubscription, message: EventMessage): Promise<void> {
    const failure = await deliverWithRetry(subscription.handler, message);

    if (failure === null) {
      return;
    }

    await this.producer.send({
      topic: `${subscription.topic}${DEAD_LETTER_SUFFIX}`,
      messages: [{ ...message, headers: { erro: describeError(failure), grupo: subscription.groupId } }]
    });
  }
}
