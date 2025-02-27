/*
  Warnings:

  - A unique constraint covering the columns `[token_recuperacion]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "fecha_expiracion_token_recuperacion" TIMESTAMP(6),
ADD COLUMN     "token_recuperacion" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_token_recuperacion_key" ON "usuarios"("token_recuperacion");
