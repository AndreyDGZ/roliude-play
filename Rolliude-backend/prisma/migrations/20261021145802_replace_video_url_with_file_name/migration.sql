/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `filmes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "filmes" DROP COLUMN "videoUrl",
ADD COLUMN     "videoFileName" TEXT;
