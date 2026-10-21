import path from 'path';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

const videosDirectory = path.join(process.cwd(), 'uploads', 'videos');

const filmeInclude = {
  generos: {
    select: {
      genero: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  },
  municipio: {
    select: {
      id: true,
      nome: true,
      estado: {
        select: {
          id: true,
          uf: true,
          nome: true
        }
      }
    }
  }
} satisfies Prisma.FilmeInclude;

export interface CreateMovieData {
  titulo: string;
  tituloOriginal?: string;
  sinopse?: string;
  anoLancamento?: number;
  duracaoMin?: number;
  posterUrl?: string;
  trailerUrl?: string;
  videoUrl?: string;
  dominioPublico?: boolean;
  publicado?: boolean;
  municipioId?: string;
  generoIds?: string[];
}

export interface UpdateMovieData extends Partial<CreateMovieData> {}

export class MovieService {
  async findAll(query: { page?: number; pageSize?: number; search?: string; publicado?: boolean; generoId?: string }) {
    const where: Prisma.FilmeWhereInput = {};

    if (query.publicado !== undefined) {
      where.publicado = query.publicado;
    }

    if (query.search) {
      where.OR = [
        { titulo: { contains: query.search, mode: 'insensitive' } },
        { sinopse: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.generoId) {
      where.generos = {
        some: {
          generoId: query.generoId
        }
      };
    }

    return prisma.filme.findMany({
      where,
      include: filmeInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return prisma.filme.findUnique({
      where: { id },
      include: filmeInclude
    });
  }

  async create(data: CreateMovieData) {
    const { generoIds = [], ...filmeData } = data;

    const createInput: Prisma.FilmeUncheckedCreateInput = {
      ...filmeData,
      generos: {
        create: generoIds.map((generoId: string) => ({ generoId }))
      }
    };

    return prisma.filme.create({
      data: createInput,
      include: filmeInclude
    });
  }

  async update(id: string, data: UpdateMovieData) {
    const { generoIds, ...filmeData } = data;

    const updateInput: Prisma.FilmeUncheckedUpdateInput = {
      ...filmeData
    };

    if (generoIds) {
      updateInput.generos = {
        deleteMany: {},
        create: generoIds.map((generoId: string) => ({ generoId }))
      };
    }

    return prisma.filme.update({
      where: { id },
      data: updateInput,
      include: filmeInclude
    });
  }

  async togglePublicado(id: string, publicado: boolean) {
    return prisma.filme.update({
      where: { id },
      data: { publicado },
      include: filmeInclude
    });
  }

  async getStreamFilePath(id: string): Promise<string | null> {
    const filme = await prisma.filme.findFirst({
      where: { id, publicado: true },
      select: { videoUrl: true }
    });

    if (!filme?.videoUrl) return null;
    return path.join(videosDirectory, path.basename(filme.videoUrl));
  }
}