import { Prisma } from '@prisma/client';
import { BtsItemResponse } from './bts.schema';

export const btsSelect = {
  id: true,
  filmeId: true,
  titulo: true,
  tipo: true,
  descricao: true,
  duracao: true,
  thumbnailUrl: true,
  videoUrl: true,
  galeriaFotos: true,
  entrevistado: true,
  dataPublicacao: true
} satisfies Prisma.ItemBastidoresSelect;

export type BtsRecord = Prisma.ItemBastidoresGetPayload<{ select: typeof btsSelect }>;

function formatDateBr(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function toBtsItemResponse(record: BtsRecord): BtsItemResponse {
  return {
    id: record.id,
    filmeId: record.filmeId,
    titulo: record.titulo,
    tipo: record.tipo as BtsItemResponse['tipo'],
    descricao: record.descricao,
    duracao: record.duracao,
    thumbnailUrl: record.thumbnailUrl,
    videoUrl: record.videoUrl,
    galeriaFotos: record.galeriaFotos,
    entrevistado: record.entrevistado,
    dataPublicacao: formatDateBr(record.dataPublicacao)
  };
}
