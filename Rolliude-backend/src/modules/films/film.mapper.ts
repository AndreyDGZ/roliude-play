import { ClassificacaoIndicativa, Prisma } from '@prisma/client';
import { CLASSIFICACOES_INDICATIVAS, FilmResponse } from './film.schema';

export const filmSelect = {
  id: true,
  titulo: true,
  tituloOriginal: true,
  sinopse: true,
  anoLancamento: true,
  duracaoMin: true,
  classificacaoIndicativa: true,
  idiomaOriginal: true,
  posterUrl: true,
  trailerUrl: true,
  videoUrl: true,
  dominioPublico: true,
  publicado: true,
  createdAt: true,
  updatedAt: true,
  municipio: {
    select: {
      id: true,
      nome: true,
      estado: { select: { id: true, uf: true, nome: true, regiao: true } }
    }
  },
  generos: {
    select: { genero: { select: { id: true, nome: true } } },
    orderBy: { genero: { nome: 'asc' } }
  }
} satisfies Prisma.FilmeSelect;

export type FilmRecord = Prisma.FilmeGetPayload<{ select: typeof filmSelect }>;

export type FilmClassification = (typeof CLASSIFICACOES_INDICATIVAS)[number];

const CLASSIFICATION_TO_API: Record<ClassificacaoIndicativa, FilmClassification> = {
  L: 'L',
  DEZ: '10',
  DOZE: '12',
  QUATORZE: '14',
  DEZESSEIS: '16',
  DEZOITO: '18'
};

const CLASSIFICATION_TO_DATABASE: Record<FilmClassification, ClassificacaoIndicativa> = {
  L: 'L',
  '10': 'DEZ',
  '12': 'DOZE',
  '14': 'QUATORZE',
  '16': 'DEZESSEIS',
  '18': 'DEZOITO'
};

export function classificationToDatabase(classification: FilmClassification): ClassificacaoIndicativa {
  return CLASSIFICATION_TO_DATABASE[classification];
}

export function toFilmResponse(record: FilmRecord, viewer: 'public' | 'admin'): FilmResponse {
  const canSeeVideo = viewer === 'admin' || record.dominioPublico;

  return {
    id: record.id,
    titulo: record.titulo,
    tituloOriginal: record.tituloOriginal,
    sinopse: record.sinopse,
    anoLancamento: record.anoLancamento,
    duracaoMin: record.duracaoMin,
    classificacaoIndicativa: CLASSIFICATION_TO_API[record.classificacaoIndicativa],
    idiomaOriginal: record.idiomaOriginal,
    posterUrl: record.posterUrl,
    trailerUrl: record.trailerUrl,
    videoUrl: canSeeVideo ? record.videoUrl : null,
    dominioPublico: record.dominioPublico,
    publicado: record.publicado,
    municipio: record.municipio,
    generos: record.generos.map(item => item.genero),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}
