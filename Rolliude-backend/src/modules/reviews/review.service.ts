import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/errors/app-error';
import { movieSelect, toMovieResponse } from '../movies/movie.mapper';
import { MovieResponse } from '../movies/movie.schema';
import { moderatedReviewSelect, toModeratedReviewResponse } from './review.mapper';
import { CreateReviewInput, ListReviewsQuery, PaginatedReviews } from './review.schema';

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

      await this.recalculateMovieRating(transaction, movieId);

      return transaction.filme.findUniqueOrThrow({ where: { id: movieId }, select: movieSelect });
    });

    return toMovieResponse(updated);
  }

  async list(query: ListReviewsQuery): Promise<PaginatedReviews> {
    const [total, reviews] = await prisma.$transaction([
      prisma.avaliacao.count(),
      prisma.avaliacao.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        select: moderatedReviewSelect
      })
    ]);

    return {
      data: reviews.map(toModeratedReviewResponse),
      meta: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite)
      }
    };
  }

  async remove(reviewId: string): Promise<void> {
    const review = await prisma.avaliacao.findUnique({ where: { id: reviewId }, select: { filmeId: true } });

    if (!review) {
      throw new AppError('Avaliação não encontrada.', 404);
    }

    await prisma.$transaction(async transaction => {
      await transaction.avaliacao.delete({ where: { id: reviewId } });
      await this.recalculateMovieRating(transaction, review.filmeId);
    });
  }

  private async recalculateMovieRating(transaction: Prisma.TransactionClient, movieId: string): Promise<void> {
    const aggregate = await transaction.avaliacao.aggregate({
      where: { filmeId: movieId },
      _avg: { nota: true },
      _count: true
    });

    await transaction.filme.update({
      where: { id: movieId },
      data: {
        notaMedia: Math.round((aggregate._avg.nota ?? 0) * 10) / 10,
        avaliacoesCount: aggregate._count
      }
    });
  }

  private async assertMovieExists(movieId: string): Promise<void> {
    const movie = await prisma.filme.findUnique({ where: { id: movieId }, select: { id: true } });

    if (!movie) {
      throw new AppError('Filme não encontrado.', 404);
    }
  }
}
