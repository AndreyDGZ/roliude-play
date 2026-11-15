import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/errors/app-error';
import { movieSelect, toMovieResponse } from '../movies/movie.mapper';
import { MovieResponse } from '../movies/movie.schema';
import { CreateReviewInput } from './review.schema';

export class ReviewService {
  async create(movieId: string, data: CreateReviewInput): Promise<MovieResponse> {
    await this.assertMovieExists(movieId);

    const updated = await prisma.$transaction(async transaction => {
      await transaction.avaliacao.create({
        data: {
          filmeId: movieId,
          autor: data.autor,
          cidade: data.cidade,
          nota: data.nota,
          comentario: data.comentario
        }
      });

      const aggregate = await transaction.avaliacao.aggregate({
        where: { filmeId: movieId },
        _avg: { nota: true },
        _count: true
      });

      return transaction.filme.update({
        where: { id: movieId },
        data: {
          notaMedia: Math.round((aggregate._avg.nota ?? 0) * 10) / 10,
          avaliacoesCount: aggregate._count
        },
        select: movieSelect
      });
    });

    return toMovieResponse(updated);
  }

  private async assertMovieExists(movieId: string): Promise<void> {
    const movie = await prisma.filme.findUnique({ where: { id: movieId }, select: { id: true } });

    if (!movie) {
      throw new AppError('Filme não encontrado.', 404);
    }
  }
}
