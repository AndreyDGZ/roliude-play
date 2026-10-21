import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filmes = await prisma.filme.findMany({
    select: {
      id: true,
      titulo: true,
    },
  });

  console.log(filmes);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });