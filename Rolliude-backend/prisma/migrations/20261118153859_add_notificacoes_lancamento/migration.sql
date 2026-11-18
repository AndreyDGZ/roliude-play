-- AlterTable
ALTER TABLE "filmes" ADD COLUMN     "lancado_em" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "eventos_outbox" (
    "id" TEXT NOT NULL,
    "topico" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "ultimo_erro" TEXT,
    "publicado_em" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "filme_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes_leituras" (
    "notificacao_id" TEXT NOT NULL,
    "dispositivo_id" TEXT NOT NULL,
    "lida_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_leituras_pkey" PRIMARY KEY ("notificacao_id","dispositivo_id")
);

-- CreateIndex
CREATE INDEX "eventos_outbox_publicado_em_created_at_idx" ON "eventos_outbox"("publicado_em", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "notificacoes_event_id_key" ON "notificacoes"("event_id");

-- CreateIndex
CREATE INDEX "notificacoes_created_at_idx" ON "notificacoes"("created_at" DESC);

-- CreateIndex
CREATE INDEX "notificacoes_leituras_dispositivo_id_idx" ON "notificacoes_leituras"("dispositivo_id");

-- CreateIndex
CREATE INDEX "filmes_lancado_em_idx" ON "filmes"("lancado_em");

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes_leituras" ADD CONSTRAINT "notificacoes_leituras_notificacao_id_fkey" FOREIGN KEY ("notificacao_id") REFERENCES "notificacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
