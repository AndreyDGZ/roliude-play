-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- DropIndex
DROP INDEX "filmes_publicado_idx";

-- AlterTable
ALTER TABLE "filmes" ADD COLUMN "titulo_busca" TEXT NOT NULL DEFAULT '';

UPDATE "filmes"
SET "titulo_busca" = btrim(lower(translate("titulo" || ' ' || coalesce("titulo_original", ''), 'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ', 'aaaaaeeeeiiiiooooouuuucnaaaaaeeeeiiiiooooouuuucn')));

-- CreateIndex
CREATE INDEX "filmes_publicado_createdAt_idx" ON "filmes"("publicado", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "filmes_titulo_busca_idx" ON "filmes" USING GIN ("titulo_busca" gin_trgm_ops);
