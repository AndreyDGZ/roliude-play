import cors from 'cors';
import express, { Request, Response } from 'express';
import { env } from '../config/env';
import { authRoutes } from '../modules/auth/auth.routes';
import { adminMovieRoutes } from '../modules/movies/movie.routes';
import { docsRoutes } from '../modules/docs/docs.routes';
import { filmAdminRoutes, filmRoutes } from '../modules/films/film.routes';
import { genreRoutes } from '../modules/genres/genre.routes';
import { locationRoutes } from '../modules/locations/location.routes';
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
app.use('/api/admin/movies', adminMovieRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/admin/films', filmAdminRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/docs', docsRoutes);
app.use(errorHandler);
