import { ClassificacaoIndicativa, Prisma } from '@prisma/client';
import { MovieResponse } from './movie.schema';

export type MovieClassification = 'Livre' | '10' | '12' | '14' | '16' | '18';

const CLASSIFICATION_TO_API: Record<ClassificacaoIndicativa, MovieClassification> = {
  L: 'Livre',
  DEZ: '10',
  DOZE: '12',
  QUATORZE: '14',
  DEZESSEIS: '16',
  DEZOITO: '18'
};

const CLASSIFICATION_TO_DATABASE: Record<MovieClassification, ClassificacaoIndicativa> = {
  Livre: 'L',
  '10': 'DEZ',
  '12': 'DOZE',
  '14': 'QUATORZE',
  '16': 'DEZESSEIS',
  '18': 'DEZOITO'
};

export function classificationToApi(classification: ClassificacaoIndicativa): MovieClassification {
  return CLASSIFICATION_TO_API[classification];
}

export function classificationToDatabase(classification: MovieClassification): ClassificacaoIndicativa {
  return CLASSIFICATION_TO_DATABASE[classification];
}

export const movieSelect = {
  id: true,
  titulo: true,
  tituloOriginal: true,
  sinopse: true,
  posterUrl: true,
  backdropUrl: true,
  trailerUrl: true,
  videoUrl: true,
  ano: true,
  duracaoMinutos: true,
  genero: true,
  classificacaoIndicativa: true,
  localizacaoPais: true,
  localizacaoRegiao: true,
  localizacaoEstado: true,
  localizacaoEstadoSigla: true,
  localizacaoMunicipio: true,
  direcao: true,
  roteiro: true,
  producao: true,
  fotografia: true,
  trilhaSonora: true,
  produtora: true,
  premios: true,
  curiosidades: true,
  destaqueCuradoria: true,
  curadoriaTag: true,
  popularidade: true,
  notaMedia: true,
  avaliacoesCount: true,
  lancadoEm: true,
  elenco: { orderBy: { ordem: 'asc' } },
  avaliacoes: { orderBy: { createdAt: 'desc' } },
  profissionais: { select: { id: true, nome: true } }
} satisfies Prisma.FilmeSelect;

export type MovieRecord = Prisma.FilmeGetPayload<{ select: typeof movieSelect }>;

function formatDateBr(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function toMovieResponse(record: MovieRecord): MovieResponse {
  return {
    id: record.id,
    titulo: record.titulo,
    tituloOriginal: record.tituloOriginal,
    sinopse: record.sinopse,
    posterUrl: record.posterUrl,
    backdropUrl: record.backdropUrl,
    trailerUrl: record.trailerUrl,
    videoUrl: record.videoUrl,
    ano: record.ano,
    duracaoMinutos: record.duracaoMinutos,
    genero: record.genero,
    classificacaoIndicativa: classificationToApi(record.classificacaoIndicativa),
    localizacao: {
      pais: record.localizacaoPais,
      regiao: record.localizacaoRegiao as MovieResponse['localizacao']['regiao'],
      estado: record.localizacaoEstado,
      estadoSigla: record.localizacaoEstadoSigla,
      municipio: record.localizacaoMunicipio
    },
    direcao: record.direcao,
    roteiro: record.roteiro,
    producao: record.producao,
    elenco: record.elenco.map(item => ({
      id: item.id,
      nome: item.nome,
      personagem: item.personagem,
      foto: item.foto
    })),
    fotografia: record.fotografia,
    trilhaSonora: record.trilhaSonora,
    produtora: record.produtora,
    premios: record.premios,
    curiosidades: record.curiosidades,
    destaqueCuradoria: record.destaqueCuradoria,
    curadoriaTag: record.curadoriaTag,
    popularidade: record.popularidade,
    notaMedia: record.notaMedia,
    avaliacoesCount: record.avaliacoesCount,
    lancadoEm: record.lancadoEm ? record.lancadoEm.toISOString() : null,
    reviews: record.avaliacoes.map(review => ({
      id: review.id,
      autor: review.autor,
      cidade: review.cidade,
      nota: review.nota,
      comentario: review.comentario,
      data: formatDateBr(review.createdAt)
    })),
    profissionais: record.profissionais
  };
}
