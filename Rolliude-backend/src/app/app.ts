import cors from 'cors';
import express, { Request, Response } from 'express';
import { env } from '../config/env';
import { authRoutes } from '../modules/auth/auth.routes';
import { adminDashboardRoutes } from '../modules/dashboard/dashboard.routes';
import { adminMovieRoutes, publicMovieRoutes } from '../modules/movies/movie.routes';
import { userRoutes } from '../modules/users/user.routes';
import { errorHandler } from '../shared/errors/error-handler';

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', publicMovieRoutes);
app.use('/api/admin/movies', adminMovieRoutes);
app.use('/admin/dashboard', adminDashboardRoutes);

// ⚠️ O errorHandler DEVE ser o último middleware registrado
app.use(errorHandler);