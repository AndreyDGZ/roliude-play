-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "classificacao_indicativa" AS ENUM ('L', '10', '12', '14', '16', '18');

-- CreateTable
CREATE TABLE "filmes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "titulo_original" TEXT,
    "titulo_busca" TEXT NOT NULL DEFAULT '',
    "sinopse" TEXT NOT NULL,
    "poster_url" TEXT NOT NULL,
    "backdrop_url" TEXT NOT NULL,
    "trailer_url" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "genero" TEXT[],
    "classificacao_indicativa" "classificacao_indicativa" NOT NULL DEFAULT 'L',
    "localizacao_pais" TEXT NOT NULL,
    "localizacao_regiao" TEXT NOT NULL,
    "localizacao_estado" TEXT NOT NULL,
    "localizacao_estado_sigla" TEXT NOT NULL,
    "localizacao_municipio" TEXT NOT NULL,
    "direcao" TEXT[],
    "roteiro" TEXT[],
    "producao" TEXT[],
    "fotografia" TEXT NOT NULL,
    "trilha_sonora" TEXT NOT NULL,
    "produtora" TEXT NOT NULL,
    "premios" TEXT[],
    "curiosidades" TEXT[],
    "destaque_curadoria" BOOLEAN NOT NULL DEFAULT false,
    "curadoria_tag" TEXT,
    "popularidade" INTEGER NOT NULL DEFAULT 0,
    "nota_media" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avaliacoes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elenco_itens" (
    "id" TEXT NOT NULL,
    "filme_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "personagem" TEXT NOT NULL,
    "foto" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "elenco_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_bastidores" (
    "id" TEXT NOT NULL,
    "filme_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "duracao" TEXT,
    "thumbnail_url" TEXT NOT NULL,
    "video_url" TEXT,
    "galeria_fotos" TEXT[],
    "entrevistado" TEXT,
    "data_publicacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_bastidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "filme_id" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissionais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcoes" TEXT[],
    "foto" TEXT NOT NULL,
    "cidade_natal" TEXT NOT NULL,
    "estado_natal" TEXT NOT NULL,
    "biografia" TEXT NOT NULL,
    "premios" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfissionalFilmes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfissionalFilmes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "filmes_ano_idx" ON "filmes"("ano");

-- CreateIndex
CREATE INDEX "filmes_destaque_curadoria_idx" ON "filmes"("destaque_curadoria");

-- CreateIndex
CREATE INDEX "filmes_localizacao_estado_sigla_idx" ON "filmes"("localizacao_estado_sigla");

-- CreateIndex
CREATE INDEX "filmes_genero_idx" ON "filmes" USING GIN ("genero");

-- CreateIndex
CREATE INDEX "filmes_titulo_busca_idx" ON "filmes" USING GIN ("titulo_busca" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "elenco_itens_filme_id_idx" ON "elenco_itens"("filme_id");

-- CreateIndex
CREATE INDEX "itens_bastidores_filme_id_idx" ON "itens_bastidores"("filme_id");

-- CreateIndex
CREATE INDEX "avaliacoes_filme_id_created_at_idx" ON "avaliacoes"("filme_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "_ProfissionalFilmes_B_index" ON "_ProfissionalFilmes"("B");

-- AddForeignKey
ALTER TABLE "elenco_itens" ADD CONSTRAINT "elenco_itens_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_bastidores" ADD CONSTRAINT "itens_bastidores_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfissionalFilmes" ADD CONSTRAINT "_ProfissionalFilmes_A_fkey" FOREIGN KEY ("A") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfissionalFilmes" ADD CONSTRAINT "_ProfissionalFilmes_B_fkey" FOREIGN KEY ("B") REFERENCES "profissionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;
