import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/errors/app-error';
import { btsSelect, toBtsItemResponse } from './bts.mapper';
import { BtsItemResponse, CreateBtsItemInput, ListBtsQuery, UpdateBtsItemInput } from './bts.schema';

export class BtsService {
  async list(query: ListBtsQuery): Promise<BtsItemResponse[]> {
    const where: Prisma.ItemBastidoresWhereInput = query.filmeId ? { filmeId: query.filmeId } : {};

    const items = await prisma.itemBastidores.findMany({
      where,
      orderBy: { dataPublicacao: 'desc' },
      select: btsSelect
    });

    return items.map(toBtsItemResponse);
  }

  async getById(itemId: string): Promise<BtsItemResponse> {
    const item = await prisma.itemBastidores.findUnique({ where: { id: itemId }, select: btsSelect });

    if (!item) {
      throw new AppError('Conteúdo de bastidores não encontrado.', 404);
    }

    return toBtsItemResponse(item);
  }

  async create(data: CreateBtsItemInput): Promise<BtsItemResponse> {
    await this.assertMovieExists(data.filmeId);

    const created = await prisma.itemBastidores.create({
      data: { ...data, dataPublicacao: new Date(data.dataPublicacao) },
      select: btsSelect
    });

    return toBtsItemResponse(created);
  }

  async update(itemId: string, data: UpdateBtsItemInput): Promise<BtsItemResponse> {
    await this.assertItemExists(itemId);

    if (data.filmeId) {
      await this.assertMovieExists(data.filmeId);
    }

    const { dataPublicacao, ...rest } = data;
    const updated = await prisma.itemBastidores.update({
      where: { id: itemId },
      data: { ...rest, ...(dataPublicacao ? { dataPublicacao: new Date(dataPublicacao) } : {}) },
      select: btsSelect
    });

    return toBtsItemResponse(updated);
  }

  async remove(itemId: string): Promise<void> {
    await this.assertItemExists(itemId);
    await prisma.itemBastidores.delete({ where: { id: itemId } });
  }

  private async assertItemExists(itemId: string): Promise<void> {
    const item = await prisma.itemBastidores.findUnique({ where: { id: itemId }, select: { id: true } });

    if (!item) {
      throw new AppError('Conteúdo de bastidores não encontrado.', 404);
    }
  }

  private async assertMovieExists(movieId: string): Promise<void> {
    const movie = await prisma.filme.findUnique({ where: { id: movieId }, select: { id: true } });

    if (!movie) {
      throw new AppError('Filme não encontrado.', 422);
    }
  }
}
