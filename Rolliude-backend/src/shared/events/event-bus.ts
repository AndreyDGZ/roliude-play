export interface EventMessage {
  key: string;
  value: string;
  headers?: Record<string, string>;
}

export type EventHandler = (message: EventMessage) => Promise<void>;

export interface EventSubscription {
  topic: string;
  groupId: string;
  fromBeginning: boolean;
  handler: EventHandler;
}

export interface EventBus {
  start(): Promise<void>;
  publish(topic: string, message: EventMessage): Promise<void>;
  subscribe(subscription: EventSubscription): Promise<void>;
  stop(): Promise<void>;
}

export const MAX_DELIVERY_ATTEMPTS = 3;

export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function writeEventWarning(message: string): void {
  process.stderr.write(`[events] ${message}\n`);
}

export async function deliverWithRetry(handler: EventHandler, message: EventMessage): Promise<unknown> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_DELIVERY_ATTEMPTS; attempt += 1) {
    try {
      await handler(message);
      return null;
    } catch (error) {
      lastError = error;
    }
  }

  return lastError;
}
