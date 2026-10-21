import type { Prisma, StatusFilme } from '@prisma/client';
import { prisma } from '../../config/prisma';
import type { MovieInput, MovieListQuery, MovieUpdateInput } from './movie.schema';

const filmeInclude = { generos: true } satisfies Prisma.FilmeInclude;

function connectGeneros(generoIds: string[]) {
  return generoIds.map((generoId) => ({ id: generoId }));
}

export const movieService = {
  async list(query: MovieListQuery) {
    const where: Prisma.FilmeWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { titulo: { contains: query.search, mode: 'insensitive' } },
              { diretor: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.filme.findMany({
        where,
        include: filmeInclude,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.filme.count({ where }),
    ]);

    return { items, total, page: query.page, pageSize: query.pageSize };
  },

  findById: (id: string) => prisma.filme.findUnique({ where: { id }, include: filmeInclude }),

  create(data: MovieInput) {
    const { generoIds, ...filmeData } = data;
    return prisma.filme.create({
      data: { ...filmeData, generos: { connect: connectGeneros(generoIds) } },
      include: filmeInclude,
    });
  },

  update(id: string, data: MovieUpdateInput) {
    const { generoIds, ...filmeData } = data;
    return prisma.filme.update({
      where: { id },
      data: {
        ...filmeData,
        ...(generoIds ? { generos: { set: connectGeneros(generoIds) } } : {}),
      },
      include: filmeInclude,
    });
  },

  setStatus: (id: string, status: StatusFilme) =>
    prisma.filme.update({ where: { id }, data: { status }, include: filmeInclude }),

  remove: (id: string) => prisma.filme.delete({ where: { id } }),

  listGeneros: () => prisma.genero.findMany({ orderBy: { nome: 'asc' } }),
};
