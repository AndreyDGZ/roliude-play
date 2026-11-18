import { EventoOutbox, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { EventBus, describeError, writeEventWarning } from '../../shared/events/event-bus';
import { releaseEventSchema } from '../../shared/events/release-event.schema';

const OUTBOX_BATCH_SIZE = 50;
const OUTBOX_TRANSACTION_TIMEOUT_MS = 30000;

interface PendingOutboxRow {
  id: string;
}

export class OutboxRelay {
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly eventBus: EventBus,
    private readonly intervalMs: number
  ) {}

  start(): void {
    this.timer = setInterval(() => {
      void this.tick();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private async tick(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;

    try {
      await prisma.$transaction(transaction => this.publishPendingBatch(transaction), {
        timeout: OUTBOX_TRANSACTION_TIMEOUT_MS
      });
    } catch (error) {
      writeEventWarning(`falha no relay do outbox: ${describeError(error)}`);
    } finally {
      this.running = false;
    }
  }

  private async publishPendingBatch(transaction: Prisma.TransactionClient): Promise<void> {
    const pendingRows = await transaction.$queryRaw<PendingOutboxRow[]>`
      SELECT id FROM eventos_outbox
      WHERE publicado_em IS NULL
      ORDER BY created_at
      LIMIT ${OUTBOX_BATCH_SIZE}
      FOR UPDATE SKIP LOCKED
    `;

    if (pendingRows.length === 0) {
      return;
    }

    const entries = await transaction.eventoOutbox.findMany({
      where: { id: { in: pendingRows.map(row => row.id) } },
      orderBy: { createdAt: 'asc' }
    });

    for (const entry of entries) {
      const published = await this.publishEntry(transaction, entry);

      if (!published) {
        return;
      }
    }
  }

  private async publishEntry(transaction: Prisma.TransactionClient, entry: EventoOutbox): Promise<boolean> {
    try {
      const event = releaseEventSchema.parse(entry.payload);
      await this.eventBus.publish(entry.topico, { key: entry.chave, value: JSON.stringify(event) });
      await transaction.eventoOutbox.update({
        where: { id: entry.id },
        data: { publicadoEm: new Date(), ultimoErro: null }
      });

      return true;
    } catch (error) {
      await transaction.eventoOutbox.update({
        where: { id: entry.id },
        data: { tentativas: { increment: 1 }, ultimoErro: describeError(error) }
      });

      return false;
    }
  }
}
