/*
  Warnings:

  - You are about to drop the column `cantidad` on the `carrito` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_agregado` on the `carrito` table. All the data in the column will be lost.
  - You are about to drop the column `producto_id` on the `carrito` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuario_id]` on the table `carrito` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "carrito" DROP CONSTRAINT "carrito_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "carrito" DROP CONSTRAINT "carrito_usuario_id_fkey";

-- DropIndex
DROP INDEX "usuarios_token_recuperacion_key";

-- AlterTable
ALTER TABLE "carrito" DROP COLUMN "cantidad",
DROP COLUMN "fecha_agregado",
DROP COLUMN "producto_id",
ADD COLUMN     "total" DECIMAL(10,2) DEFAULT 0.00;

-- CreateTable
CREATE TABLE "carrito_item" (
    "id" SERIAL NOT NULL,
    "carrito_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "carrito_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carrito_item_carrito_id_producto_id_key" ON "carrito_item"("carrito_id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "carrito_usuario_id_key" ON "carrito"("usuario_id");

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_item" ADD CONSTRAINT "carrito_item_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carrito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_item" ADD CONSTRAINT "carrito_item_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
