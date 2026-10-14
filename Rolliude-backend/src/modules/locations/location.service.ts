import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/errors/app-error';
import { ListStatesQuery, MunicipalityResponse, StateResponse } from './location.schema';

export class LocationService {
  async listStates(query: ListStatesQuery): Promise<StateResponse[]> {
    return prisma.estado.findMany({
      where: query.regiao ? { regiao: query.regiao } : {},
      select: { id: true, uf: true, nome: true, regiao: true },
      orderBy: { nome: 'asc' }
    });
  }

  async listMunicipalities(uf: string): Promise<MunicipalityResponse[]> {
    const state = await prisma.estado.findUnique({ where: { uf }, select: { id: true } });

    if (!state) {
      throw new AppError('Estado não encontrado.', 404);
    }

    return prisma.municipio.findMany({
      where: { estadoId: state.id },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' }
    });
  }
}
