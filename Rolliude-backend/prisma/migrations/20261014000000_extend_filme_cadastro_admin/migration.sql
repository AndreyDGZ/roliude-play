-- CreateEnum
CREATE TYPE "StatusFilme" AS ENUM ('RASCUNHO', 'PUBLICADO', 'ARQUIVADO');

-- AlterTable
ALTER TABLE "filmes" ADD COLUMN     "anoLancamento" INTEGER,
ADD COLUMN     "classificacaoIndicativa" TEXT,
ADD COLUMN     "diretor" TEXT,
ADD COLUMN     "duracaoMinutos" INTEGER,
ADD COLUMN     "idioma" TEXT NOT NULL DEFAULT 'pt-BR',
ADD COLUMN     "posterUrl" TEXT,
ADD COLUMN     "sinopse" TEXT,
ADD COLUMN     "status" "StatusFilme" NOT NULL DEFAULT 'RASCUNHO',
ADD COLUMN     "trailerUrl" TEXT;

-- CreateTable
CREATE TABLE "_FilmeToGenero" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FilmeToGenero_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FilmeToGenero_B_index" ON "_FilmeToGenero"("B");

-- CreateIndex
CREATE INDEX "filmes_status_idx" ON "filmes"("status");

-- CreateIndex
CREATE INDEX "filmes_anoLancamento_idx" ON "filmes"("anoLancamento");

-- AddForeignKey
ALTER TABLE "_FilmeToGenero" ADD CONSTRAINT "_FilmeToGenero_A_fkey" FOREIGN KEY ("A") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmeToGenero" ADD CONSTRAINT "_FilmeToGenero_B_fkey" FOREIGN KEY ("B") REFERENCES "generos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

