import { ClassificacaoIndicativa, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/errors/app-error';
import { classificationToDatabase, FilmClassification, filmSelect, toFilmResponse } from './film.mapper';
import {
  CreateFilmInput,
  FilmResponse,
  ListAdminFilmsQuery,
  ListFilmsQuery,
  PaginatedFilms,
  UpdateFilmInput
} from './film.schema';
import { buildSearchField, buildSearchTokens } from './film.search';

interface FilmTitles {
  titulo: string;
  tituloOriginal: string | null;
}

const ORDER_BY: Record<ListFilmsQuery['ordenar'], Prisma.FilmeOrderByWithRelationInput[]> = {
  recentes: [{ createdAt: 'desc' }, { id: 'asc' }],
  titulo: [{ titulo: 'asc' }, { id: 'asc' }],
  ano: [{ anoLancamento: { sort: 'desc', nulls: 'last' } }, { titulo: 'asc' }, { id: 'asc' }]
};

export class FilmService {
  async listPublished(query: ListFilmsQuery): Promise<PaginatedFilms> {
    return this.list({ publicado: true }, query, 'public');
  }

  async listAll(query: ListAdminFilmsQuery): Promise<PaginatedFilms> {
    const where: Prisma.FilmeWhereInput = query.publicado ? { publicado: query.publicado === 'true' } : {};

    return this.list(where, query, 'admin');
  }

  async getPublished(filmId: string): Promise<FilmResponse> {
    const film = await prisma.filme.findFirst({
      where: { id: filmId, publicado: true },
      select: filmSelect
    });

    if (!film) {
      throw new AppError('Filme não encontrado.', 404);
    }

    return toFilmResponse(film, 'public');
  }

  async getAny(filmId: string): Promise<FilmResponse> {
    const film = await prisma.filme.findUnique({ where: { id: filmId }, select: filmSelect });

    if (!film) {
      throw new AppError('Filme não encontrado.', 404);
    }

    return toFilmResponse(film, 'admin');
  }

  async create(data: CreateFilmInput): Promise<FilmResponse> {
    await this.assertReferencesExist(data.municipioId, data.generoIds);

    const { generoIds = [], classificacaoIndicativa, ...scalarFields } = data;
    const createData: Prisma.FilmeUncheckedCreateInput = {
      ...scalarFields,
      tituloBusca: buildSearchField(data.titulo, data.tituloOriginal),
      ...this.toClassificationField(classificacaoIndicativa),
      generos: { create: generoIds.map(generoId => ({ generoId })) }
    };

    const created = await prisma.filme.create({ data: createData, select: filmSelect });

    return toFilmResponse(created, 'admin');
  }

  async update(filmId: string, data: UpdateFilmInput): Promise<FilmResponse> {
    const current = await this.findTitles(filmId);
    await this.assertReferencesExist(data.municipioId, data.generoIds);

    const { generoIds, classificacaoIndicativa, ...scalarFields } = data;
    const updateData: Prisma.FilmeUncheckedUpdateInput = {
      ...scalarFields,
      ...this.toSearchField(data, current),
      ...this.toClassificationField(classificacaoIndicativa),
      ...(generoIds ? { generos: { deleteMany: {}, create: generoIds.map(generoId => ({ generoId })) } } : {})
    };

    const updated = await prisma.filme.update({ where: { id: filmId }, data: updateData, select: filmSelect });

    return toFilmResponse(updated, 'admin');
  }

  async remove(filmId: string): Promise<void> {
    await this.assertFilmExists(filmId);
    await prisma.filme.delete({ where: { id: filmId } });
  }

  private async list(
    baseWhere: Prisma.FilmeWhereInput,
    query: ListFilmsQuery,
    viewer: 'public' | 'admin'
  ): Promise<PaginatedFilms> {
    const where: Prisma.FilmeWhereInput = { AND: [baseWhere, ...this.buildCatalogFilters(query)] };
    const [total, films] = await prisma.$transaction([
      prisma.filme.count({ where }),
      prisma.filme.findMany({
        where,
        orderBy: ORDER_BY[query.ordenar],
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        select: filmSelect
      })
    ]);

    return {
      data: films.map(film => toFilmResponse(film, viewer)),
      meta: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite)
      }
    };
  }

  private buildCatalogFilters(query: ListFilmsQuery): Prisma.FilmeWhereInput[] {
    const filters: Prisma.FilmeWhereInput[] = buildSearchTokens(query.busca).map(token => ({
      tituloBusca: { contains: token }
    }));

    if (query.regiao) {
      filters.push({ municipio: { estado: { regiao: query.regiao } } });
    }

    if (query.uf) {
      filters.push({ municipio: { estado: { uf: query.uf } } });
    }

    if (query.municipioId) {
      filters.push({ municipioId: query.municipioId });
    }

    if (query.generoId) {
      filters.push({ generos: { some: { generoId: query.generoId } } });
    }

    if (query.ano) {
      filters.push({ anoLancamento: query.ano });
    }

    return filters;
  }

  private toClassificationField(classification?: FilmClassification): { classificacaoIndicativa?: ClassificacaoIndicativa } {
    return classification ? { classificacaoIndicativa: classificationToDatabase(classification) } : {};
  }

  private toSearchField(data: UpdateFilmInput, current: FilmTitles): { tituloBusca?: string } {
    if (data.titulo === undefined && data.tituloOriginal === undefined) {
      return {};
    }

    const title = data.titulo ?? current.titulo;
    const originalTitle = data.tituloOriginal === undefined ? current.tituloOriginal : data.tituloOriginal;

    return { tituloBusca: buildSearchField(title, originalTitle) };
  }

  private async findTitles(filmId: string): Promise<FilmTitles> {
    const film = await prisma.filme.findUnique({
      where: { id: filmId },
      select: { titulo: true, tituloOriginal: true }
    });

    if (!film) {
      throw new AppError('Filme não encontrado.', 404);
    }

    return film;
  }

  private async assertFilmExists(filmId: string): Promise<void> {
    const film = await prisma.filme.findUnique({ where: { id: filmId }, select: { id: true } });

    if (!film) {
      throw new AppError('Filme não encontrado.', 404);
    }
  }

  private async assertReferencesExist(municipioId?: string | null, generoIds?: string[]): Promise<void> {
    if (municipioId) {
      const municipality = await prisma.municipio.findUnique({ where: { id: municipioId }, select: { id: true } });

      if (!municipality) {
        throw new AppError('Município não encontrado.', 422);
      }
    }

    if (generoIds && generoIds.length > 0) {
      const existingGenres = await prisma.genero.count({ where: { id: { in: generoIds } } });

      if (existingGenres !== generoIds.length) {
        throw new AppError('Um ou mais gêneros informados não existem.', 422);
      }
    }
  }
}
