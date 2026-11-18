import { Response } from 'express';
import { NotificationResponse } from './notification.schema';

const HEARTBEAT_INTERVAL_MS = 25000;
const RELEASE_EVENT_NAME = 'release';

export class SseHub {
  private readonly clients = new Set<Response>();
  private heartbeatTimer: NodeJS.Timeout | null = null;

  start(): void {
    this.heartbeatTimer = setInterval(() => this.writeToAll(': ping\n\n'), HEARTBEAT_INTERVAL_MS);
  }

  open(response: Response): void {
    response.status(200);
    response.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    response.flushHeaders();
    this.clients.add(response);
  }

  remove(response: Response): void {
    this.clients.delete(response);
  }

  send(response: Response, notification: NotificationResponse): void {
    response.write(this.formatRelease(notification));
  }

  broadcast(notification: NotificationResponse): void {
    this.writeToAll(this.formatRelease(notification));
  }

  close(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.clients.forEach(client => client.end());
    this.clients.clear();
  }

  private writeToAll(chunk: string): void {
    this.clients.forEach(client => client.write(chunk));
  }

  private formatRelease(notification: NotificationResponse): string {
    return `id: ${notification.id}\nevent: ${RELEASE_EVENT_NAME}\ndata: ${JSON.stringify(notification)}\n\n`;
  }
}

export const sseHub = new SseHub();
