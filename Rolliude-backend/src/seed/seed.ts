import dotenv from 'dotenv';
import { prisma } from '../config/prisma';
import { classificationToDatabase } from '../modules/movies/movie.mapper';
import { buildSearchField } from '../shared/search/search-text';
import { seedAdmin } from './admin-seed';
import { BTS_SEEDS, MOVIE_SEEDS, PROFESSIONAL_SEEDS } from './movies-seed-data';

dotenv.config();

function parseReviewDate(value: string): Date {
  const [day, month, year] = value.split('/').map(Number);

  return new Date(year, month - 1, day);
}

async function seedMovies(): Promise<Map<string, string>> {
  const chaveToId = new Map<string, string>();

  for (const seed of MOVIE_SEEDS) {
    const { localizacao, elenco, classificacaoIndicativa, ...scalarFields } = seed.movie;
    const notaMedia =
      seed.reviews.length > 0
        ? Math.round((seed.reviews.reduce((total, review) => total + review.nota, 0) / seed.reviews.length) * 10) / 10
        : 0;

    const created = await prisma.filme.create({
      data: {
        ...scalarFields,
        classificacaoIndicativa: classificationToDatabase(classificacaoIndicativa),
        tituloBusca: buildSearchField(seed.movie.titulo, seed.movie.tituloOriginal),
        localizacaoPais: localizacao.pais,
        localizacaoRegiao: localizacao.regiao,
        localizacaoEstado: localizacao.estado,
        localizacaoEstadoSigla: localizacao.estadoSigla,
        localizacaoMunicipio: localizacao.municipio,
        notaMedia,
        avaliacoesCount: seed.reviews.length,
        elenco: { create: elenco.map((item, index) => ({ ...item, ordem: index })) },
        avaliacoes: {
          create: seed.reviews.map(review => ({
            autor: review.autor,
            cidade: review.cidade,
            nota: review.nota,
            comentario: review.comentario,
            createdAt: parseReviewDate(review.data)
          }))
        }
      }
    });

    chaveToId.set(seed.chave, created.id);
  }

  return chaveToId;
}

async function seedProfessionals(chaveToId: Map<string, string>): Promise<void> {
  for (const seed of PROFESSIONAL_SEEDS) {
    const movieIds = seed.filmesChaves
      .map(chave => chaveToId.get(chave))
      .filter((id): id is string => id !== undefined);

    await prisma.profissional.create({
      data: {
        ...seed.professional,
        ...(movieIds.length > 0 ? { filmes: { connect: movieIds.map(id => ({ id })) } } : {})
      }
    });
  }
}

async function seedBehindTheScenes(chaveToId: Map<string, string>): Promise<void> {
  for (const seed of BTS_SEEDS) {
    const filmeId = chaveToId.get(seed.filmeChave);

    if (!filmeId) {
      continue;
    }

    await prisma.itemBastidores.create({
      data: {
        ...seed.item,
        filmeId,
        dataPublicacao: new Date(seed.item.dataPublicacao)
      }
    });
  }
}

async function main(): Promise<void> {
  const chaveToId = await seedMovies();
  await seedProfessionals(chaveToId);
  await seedBehindTheScenes(chaveToId);
  await seedAdmin();
  process.stdout.write('Seed concluído.\n');
}

main()
  .catch(error => {
    process.stderr.write(`Falha ao executar o seed: ${error instanceof Error ? error.message : 'erro desconhecido'}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
