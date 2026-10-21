import { prisma } from '../../config/prisma';
import { GenreResponse } from './genre.schema';

export class GenreService {
  async list(): Promise<GenreResponse[]> {
    return prisma.genero.findMany({
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' }
    });
  }
}
