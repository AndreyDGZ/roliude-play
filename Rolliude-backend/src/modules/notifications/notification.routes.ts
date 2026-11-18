import { Router } from 'express';
import { NotificationController } from './notification.controller';

const notificationRoutes = Router();
const notificationController = new NotificationController();

notificationRoutes.get('/', notificationController.list);
notificationRoutes.get('/stream', notificationController.stream);
notificationRoutes.post('/read-all', notificationController.markAllAsRead);
notificationRoutes.post('/:id/read', notificationController.markAsRead);

export { notificationRoutes };
