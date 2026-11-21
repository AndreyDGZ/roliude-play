import { AuthenticatedUser } from '../../shared/auth/authenticated-user';
import { UserResponse } from './auth.schema';

export function toUserResponse(record: AuthenticatedUser): UserResponse {
  return {
    id: record.id,
    nome: record.nome,
    email: record.email,
    papel: record.papel,
    criadoEm: record.createdAt.toISOString()
  };
}
