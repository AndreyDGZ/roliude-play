import { Prisma } from '@prisma/client';
import { ProfessionalResponse } from './professional.schema';

export const professionalSelect = {
  id: true,
  nome: true,
  funcoes: true,
  foto: true,
  cidadeNatal: true,
  estadoNatal: true,
  biografia: true,
  premios: true,
  filmes: { select: { id: true, titulo: true } }
} satisfies Prisma.ProfissionalSelect;

export type ProfessionalRecord = Prisma.ProfissionalGetPayload<{ select: typeof professionalSelect }>;

export function toProfessionalResponse(record: ProfessionalRecord): ProfessionalResponse {
  return {
    id: record.id,
    nome: record.nome,
    funcoes: record.funcoes as ProfessionalResponse['funcoes'],
    foto: record.foto,
    cidadeNatal: record.cidadeNatal,
    estadoNatal: record.estadoNatal,
    biografia: record.biografia,
    premios: record.premios,
    filmes: record.filmes
  };
}
