/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "customer_id" TEXT;

-- CreateTable
CREATE TABLE "tarjetas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "stripe_pm_id" TEXT NOT NULL,
    "ultimos_digitos" VARCHAR(4) NOT NULL,
    "marca" VARCHAR(50) NOT NULL,
    "fecha_exp" VARCHAR(7) NOT NULL,

    CONSTRAINT "tarjetas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tarjetas_usuario_id_key" ON "tarjetas"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "tarjetas_stripe_pm_id_key" ON "tarjetas"("stripe_pm_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_customer_id_key" ON "usuarios"("customer_id");

-- AddForeignKey
ALTER TABLE "tarjetas" ADD CONSTRAINT "tarjetas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
