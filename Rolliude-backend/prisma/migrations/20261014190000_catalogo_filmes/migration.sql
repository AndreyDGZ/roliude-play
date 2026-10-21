-- CreateEnum
CREATE TYPE "papel_usuario" AS ENUM ('USUARIO', 'CURADOR', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "regiao_brasil" AS ENUM ('NORTE', 'NORDESTE', 'CENTRO_OESTE', 'SUDESTE', 'SUL');

-- CreateEnum
CREATE TYPE "classificacao_indicativa" AS ENUM ('L', '10', '12', '14', '16', '18');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "papel" "papel_usuario" NOT NULL DEFAULT 'USUARIO';

-- AlterTable
ALTER TABLE "estados" ADD COLUMN "regiao" "regiao_brasil";

UPDATE "estados" SET "regiao" = CASE
    WHEN "uf" IN ('AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO') THEN 'NORTE'::"regiao_brasil"
    WHEN "uf" IN ('AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE') THEN 'NORDESTE'::"regiao_brasil"
    WHEN "uf" IN ('DF', 'GO', 'MT', 'MS') THEN 'CENTRO_OESTE'::"regiao_brasil"
    WHEN "uf" IN ('ES', 'MG', 'RJ', 'SP') THEN 'SUDESTE'::"regiao_brasil"
    WHEN "uf" IN ('PR', 'RS', 'SC') THEN 'SUL'::"regiao_brasil"
END;

ALTER TABLE "estados" ALTER COLUMN "regiao" SET NOT NULL;

-- AlterTable
ALTER TABLE "filmes" ADD COLUMN "titulo_original" TEXT,
ADD COLUMN "sinopse" TEXT,
ADD COLUMN "ano_lancamento" INTEGER,
ADD COLUMN "duracao_min" INTEGER,
ADD COLUMN "classificacao_indicativa" "classificacao_indicativa" NOT NULL DEFAULT 'L',
ADD COLUMN "idioma_original" TEXT,
ADD COLUMN "poster_url" TEXT,
ADD COLUMN "trailer_url" TEXT,
ADD COLUMN "publicado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "municipio_id" TEXT;

-- CreateTable
CREATE TABLE "filme_genero" (
    "filme_id" TEXT NOT NULL,
    "genero_id" TEXT NOT NULL,

    CONSTRAINT "filme_genero_pkey" PRIMARY KEY ("filme_id", "genero_id")
);

-- CreateIndex
CREATE INDEX "estados_regiao_idx" ON "estados"("regiao");

-- CreateIndex
CREATE UNIQUE INDEX "municipios_estadoId_nome_key" ON "municipios"("estadoId", "nome");

-- CreateIndex
CREATE INDEX "filmes_titulo_idx" ON "filmes"("titulo");

-- CreateIndex
CREATE INDEX "filmes_ano_lancamento_idx" ON "filmes"("ano_lancamento");

-- CreateIndex
CREATE INDEX "filmes_publicado_idx" ON "filmes"("publicado");

-- CreateIndex
CREATE INDEX "filmes_municipio_id_idx" ON "filmes"("municipio_id");

-- CreateIndex
CREATE INDEX "filme_genero_genero_id_idx" ON "filme_genero"("genero_id");

-- AddForeignKey
ALTER TABLE "filmes" ADD CONSTRAINT "filmes_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "municipios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filme_genero" ADD CONSTRAINT "filme_genero_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filme_genero" ADD CONSTRAINT "filme_genero_genero_id_fkey" FOREIGN KEY ("genero_id") REFERENCES "generos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
