import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/errors/app-error';
import { professionalSelect, toProfessionalResponse } from './professional.mapper';
import {
  CreateProfessionalInput,
  ListProfessionalsQuery,
  PaginatedProfessionals,
  ProfessionalResponse,
  UpdateProfessionalInput
} from './professional.schema';

export class ProfessionalService {
  async list(query: ListProfessionalsQuery): Promise<PaginatedProfessionals> {
    const [total, professionals] = await prisma.$transaction([
      prisma.profissional.count(),
      prisma.profissional.findMany({
        orderBy: { nome: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        select: professionalSelect
      })
    ]);

    return {
      data: professionals.map(toProfessionalResponse),
      meta: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite)
      }
    };
  }

  async getById(professionalId: string): Promise<ProfessionalResponse> {
    const professional = await prisma.profissional.findUnique({
      where: { id: professionalId },
      select: professionalSelect
    });

    if (!professional) {
      throw new AppError('Profissional não encontrado.', 404);
    }

    return toProfessionalResponse(professional);
  }

  async create(data: CreateProfessionalInput): Promise<ProfessionalResponse> {
    await this.assertMoviesExist(data.filmesIds);

    const { filmesIds, ...scalarFields } = data;
    const created = await prisma.profissional.create({
      data: {
        ...scalarFields,
        ...(filmesIds ? { filmes: { connect: filmesIds.map(id => ({ id })) } } : {})
      },
      select: professionalSelect
    });

    return toProfessionalResponse(created);
  }

  async update(professionalId: string, data: UpdateProfessionalInput): Promise<ProfessionalResponse> {
    await this.assertProfessionalExists(professionalId);
    await this.assertMoviesExist(data.filmesIds);

    const { filmesIds, ...scalarFields } = data;
    const updated = await prisma.profissional.update({
      where: { id: professionalId },
      data: {
        ...scalarFields,
        ...(filmesIds ? { filmes: { set: filmesIds.map(id => ({ id })) } } : {})
      },
      select: professionalSelect
    });

    return toProfessionalResponse(updated);
  }

  async remove(professionalId: string): Promise<void> {
    await this.assertProfessionalExists(professionalId);
    await prisma.profissional.delete({ where: { id: professionalId } });
  }

  private async assertProfessionalExists(professionalId: string): Promise<void> {
    const professional = await prisma.profissional.findUnique({
      where: { id: professionalId },
      select: { id: true }
    });

    if (!professional) {
      throw new AppError('Profissional não encontrado.', 404);
    }
  }

  private async assertMoviesExist(movieIds?: string[]): Promise<void> {
    if (!movieIds || movieIds.length === 0) {
      return;
    }

    const existing = await prisma.filme.count({ where: { id: { in: movieIds } } });

    if (existing !== movieIds.length) {
      throw new AppError('Um ou mais filmes informados não existem.', 422);
    }
  }
}
