import { Prisma } from '@prisma/client';
import { ModeratedReviewResponse } from './review.schema';

export const moderatedReviewSelect = {
  id: true,
  autor: true,
  cidade: true,
  nota: true,
  comentario: true,
  createdAt: true,
  filme: { select: { id: true, titulo: true } }
} satisfies Prisma.AvaliacaoSelect;

type ModeratedReviewRecord = Prisma.AvaliacaoGetPayload<{ select: typeof moderatedReviewSelect }>;

export function toModeratedReviewResponse(record: ModeratedReviewRecord): ModeratedReviewResponse {
  return {
    id: record.id,
    autor: record.autor,
    cidade: record.cidade,
    nota: record.nota,
    comentario: record.comentario,
    data: record.createdAt.toISOString(),
    filme: { id: record.filme.id, titulo: record.filme.titulo }
  };
}
