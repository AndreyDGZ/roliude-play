import cors from 'cors';
import express, { Request, Response } from 'express';
import { env } from '../config/env';
import { adminRoutes } from '../modules/admin/admin.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { bastidoresRoutes } from '../modules/behind-the-scenes/bts.routes';
import { docsRoutes } from '../modules/docs/docs.routes';
import { movieRoutes } from '../modules/movies/movie.routes';
import { notificationRoutes } from '../modules/notifications/notification.routes';
import { professionalRoutes } from '../modules/professionals/professional.routes';
import { reviewModerationRoutes, reviewRoutes } from '../modules/reviews/review.routes';
import { errorHandler } from '../shared/errors/error-handler';

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({ status: 'ok' });
});

app.use('/api/movies', movieRoutes);
app.use('/api/movies', reviewRoutes);
app.use('/api/reviews', reviewModerationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/behind-the-scenes', bastidoresRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/docs', docsRoutes);

app.use(errorHandler);
