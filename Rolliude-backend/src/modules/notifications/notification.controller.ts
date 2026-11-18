import { NextFunction, Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { listNotificationsQuerySchema, notificationDeviceBodySchema, notificationIdParamsSchema } from './notification.schema';
import { sseHub } from './sse-hub';

export class NotificationController {
  private readonly notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  list = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listNotificationsQuerySchema.parse(request.query);

      return response.json(await this.notificationService.listForDevice(query));
    } catch (error) {
      return next(error);
    }
  };

  markAsRead = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = notificationIdParamsSchema.parse(request.params);
      const { dispositivoId } = notificationDeviceBodySchema.parse(request.body);
      await this.notificationService.markAsRead(id, dispositivoId);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  markAllAsRead = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { dispositivoId } = notificationDeviceBodySchema.parse(request.body);
      await this.notificationService.markAllAsRead(dispositivoId);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  stream = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const lastEventId = request.header('last-event-id');
      const missed = lastEventId ? await this.notificationService.listAfterEvent(lastEventId) : [];

      sseHub.open(response);
      missed.forEach(notification => sseHub.send(response, notification));
      request.on('close', () => sseHub.remove(response));
    } catch (error) {
      next(error);
    }
  };
}
