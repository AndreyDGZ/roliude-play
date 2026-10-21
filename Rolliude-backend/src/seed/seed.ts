import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { prisma } from '../config/prisma';
import { GENRE_NAMES, STATE_SEEDS } from './reference-data';

dotenv.config();

const BCRYPT_SALT_ROUNDS = 12;

async function seedGenres(): Promise<void> {
  for (const name of GENRE_NAMES) {
    await prisma.genero.upsert({ where: { nome: name }, update: {}, create: { nome: name } });
  }
}

async function seedStatesAndMunicipalities(): Promise<void> {
  for (const stateSeed of STATE_SEEDS) {
    const state = await prisma.estado.upsert({
      where: { uf: stateSeed.uf },
      update: { nome: stateSeed.nome, regiao: stateSeed.regiao },
      create: { uf: stateSeed.uf, nome: stateSeed.nome, regiao: stateSeed.regiao }
    });

    for (const municipalityName of stateSeed.municipios) {
      await prisma.municipio.upsert({
        where: { estadoId_nome: { estadoId: state.id, nome: municipalityName } },
        update: {},
        create: { estadoId: state.id, nome: municipalityName }
      });
    }
  }
}

async function seedAdministrator(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  await prisma.usuario.upsert({
    where: { email: email.toLowerCase() },
    update: { papel: 'ADMINISTRADOR' },
    create: {
      email: email.toLowerCase(),
      nome: process.env.SEED_ADMIN_NAME ?? 'Administrador',
      senha: hashedPassword,
      papel: 'ADMINISTRADOR'
    }
  });
}

async function main(): Promise<void> {
  await seedGenres();
  await seedStatesAndMunicipalities();
  await seedAdministrator();
  process.stdout.write('Seed concluído.\n');
}

main()
  .catch(error => {
    process.stderr.write(`Falha ao executar o seed: ${error instanceof Error ? error.message : 'erro desconhecido'}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
