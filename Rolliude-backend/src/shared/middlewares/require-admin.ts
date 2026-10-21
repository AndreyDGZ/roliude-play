import { timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const receivedBuffer = Buffer.from(String(request.header('x-admin-key') ?? ''));
  const expectedBuffer = Buffer.from(env.ADMIN_API_KEY);

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    response.status(401).json({ error: 'Acesso administrativo negado' });
    return;
  }

  next();
}
