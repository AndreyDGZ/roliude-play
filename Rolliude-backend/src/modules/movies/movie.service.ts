import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { RELEASE_EVENT_TYPE, RELEASE_EVENT_VERSION, ReleaseEvent } from '../../shared/events/release-event.schema';
import { AppError } from '../../shared/errors/app-error';
import { buildSearchField, buildSearchTokens } from '../../shared/search/search-text';
import { MovieRecord, classificationToApi, classificationToDatabase, movieSelect, toMovieResponse } from './movie.mapper';
import { CreateMovieInput, ListMoviesQuery, MovieResponse, PaginatedMovies, UpdateMovieInput } from './movie.schema';

interface MovieTitles {
  titulo: string;
  tituloOriginal: string | null;
}

const ORDER_BY: Record<ListMoviesQuery['ordenar'], Prisma.FilmeOrderByWithRelationInput[]> = {
  recentes: [{ createdAt: 'desc' }, { id: 'asc' }],
  titulo: [{ titulo: 'asc' }, { id: 'asc' }],
  ano: [{ ano: 'desc' }, { titulo: 'asc' }, { id: 'asc' }]
};

export class MovieService {
  async list(query: ListMoviesQuery): Promise<PaginatedMovies> {
    const where: Prisma.FilmeWhereInput = {
      AND: buildSearchTokens(query.busca).map(token => ({ tituloBusca: { contains: token } }))
    };

    const [total, movies] = await prisma.$transaction([
      prisma.filme.count({ where }),
      prisma.filme.findMany({
        where,
        orderBy: ORDER_BY[query.ordenar],
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        select: movieSelect
      })
    ]);

    return {
      data: movies.map(toMovieResponse),
      meta: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite)
      }
    };
  }

  async getById(movieId: string): Promise<MovieResponse> {
    const movie = await prisma.filme.findUnique({ where: { id: movieId }, select: movieSelect });

    if (!movie) {
      throw new AppError('Filme não encontrado.', 404);
    }

    return toMovieResponse(movie);
  }

  async create(data: CreateMovieInput): Promise<MovieResponse> {
    await this.assertProfessionalsExist(data.profissionalIds);

    const { localizacao, elenco, profissionalIds, classificacaoIndicativa, ...scalarFields } = data;
    const created = await prisma.$transaction(async transaction => {
      const movie = await transaction.filme.create({
        data: {
          ...scalarFields,
          lancadoEm: new Date(),
          classificacaoIndicativa: classificationToDatabase(classificacaoIndicativa),
          tituloBusca: buildSearchField(data.titulo, data.tituloOriginal),
          localizacaoPais: localizacao.pais,
          localizacaoRegiao: localizacao.regiao,
          localizacaoEstado: localizacao.estado,
          localizacaoEstadoSigla: localizacao.estadoSigla,
          localizacaoMunicipio: localizacao.municipio,
          elenco: {
            create: elenco.map((item, index) => ({
              nome: item.nome,
              personagem: item.personagem,
              foto: item.foto,
              ordem: index
            }))
          },
          ...(profissionalIds ? { profissionais: { connect: profissionalIds.map(id => ({ id })) } } : {})
        },
        select: movieSelect
      });

      await transaction.eventoOutbox.create({ data: this.buildReleaseOutboxEntry(movie) });

      return movie;
    });

    return toMovieResponse(created);
  }

  async update(movieId: string, data: UpdateMovieInput): Promise<MovieResponse> {
    const current = await this.findTitles(movieId);
    await this.assertProfessionalsExist(data.profissionalIds);

    const { localizacao, elenco, profissionalIds, classificacaoIndicativa, ...scalarFields } = data;

    const updated = await prisma.filme.update({
      where: { id: movieId },
      data: {
        ...scalarFields,
        ...(classificacaoIndicativa ? { classificacaoIndicativa: classificationToDatabase(classificacaoIndicativa) } : {}),
        ...this.toSearchField(data, current),
        ...(localizacao
          ? {
              localizacaoPais: localizacao.pais,
              localizacaoRegiao: localizacao.regiao,
              localizacaoEstado: localizacao.estado,
              localizacaoEstadoSigla: localizacao.estadoSigla,
              localizacaoMunicipio: localizacao.municipio
            }
          : {}),
        ...(elenco
          ? {
              elenco: {
                deleteMany: {},
                create: elenco.map((item, index) => ({
                  nome: item.nome,
                  personagem: item.personagem,
                  foto: item.foto,
                  ordem: index
                }))
              }
            }
          : {}),
        ...(profissionalIds ? { profissionais: { set: profissionalIds.map(id => ({ id })) } } : {})
      },
      select: movieSelect
    });

    return toMovieResponse(updated);
  }

  async remove(movieId: string): Promise<void> {
    await this.assertMovieExists(movieId);
    await prisma.filme.delete({ where: { id: movieId } });
  }

  private toSearchField(data: UpdateMovieInput, current: MovieTitles): { tituloBusca?: string } {
    if (data.titulo === undefined && data.tituloOriginal === undefined) {
      return {};
    }

    const title = data.titulo ?? current.titulo;
    const originalTitle = data.tituloOriginal === undefined ? current.tituloOriginal : data.tituloOriginal;

    return { tituloBusca: buildSearchField(title, originalTitle) };
  }

  private async findTitles(movieId: string): Promise<MovieTitles> {
    const movie = await prisma.filme.findUnique({
      where: { id: movieId },
      select: { titulo: true, tituloOriginal: true }
    });

    if (!movie) {
      throw new AppError('Filme não encontrado.', 404);
    }

    return movie;
  }

  private async assertMovieExists(movieId: string): Promise<void> {
    const movie = await prisma.filme.findUnique({ where: { id: movieId }, select: { id: true } });

    if (!movie) {
      throw new AppError('Filme não encontrado.', 404);
    }
  }

  private async assertProfessionalsExist(profissionalIds?: string[]): Promise<void> {
    if (!profissionalIds || profissionalIds.length === 0) {
      return;
    }

    const existing = await prisma.profissional.count({ where: { id: { in: profissionalIds } } });

    if (existing !== profissionalIds.length) {
      throw new AppError('Um ou mais profissionais informados não existem.', 422);
    }
  }

  private buildReleaseOutboxEntry(movie: MovieRecord): Prisma.EventoOutboxCreateInput {
    const event: ReleaseEvent = {
      eventId: randomUUID(),
      eventType: RELEASE_EVENT_TYPE,
      version: RELEASE_EVENT_VERSION,
      occurredAt: new Date().toISOString(),
      data: {
        filmeId: movie.id,
        titulo: movie.titulo,
        genero: movie.genero,
        municipio: movie.localizacaoMunicipio,
        estadoSigla: movie.localizacaoEstadoSigla,
        classificacaoIndicativa: classificationToApi(movie.classificacaoIndicativa),
        posterUrl: movie.posterUrl
      }
    };

    return {
      id: event.eventId,
      topico: env.KAFKA_TOPIC_RELEASES,
      chave: movie.id,
      tipoEvento: event.eventType,
      payload: event
    };
  }
}
