import bcrypt from 'bcryptjs';

const PASSWORD_HASH_ROUNDS = 10;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
}

export function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, PASSWORD_HASH_ROUNDS);
}

export function passwordMatchesHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
