/*
  Warnings:

  - Made the column `descuento` on table `cupones` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TipoDescuento" AS ENUM ('PORCENTAJE', 'MONTO');

-- AlterTable
ALTER TABLE "cupones" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categoria_id" INTEGER,
ADD COLUMN     "limite_uso" INTEGER,
ADD COLUMN     "minimo_compra" DECIMAL(10,2),
ADD COLUMN     "producto_id" INTEGER,
ADD COLUMN     "tipo_descuento" TEXT NOT NULL DEFAULT 'porcentaje',
ADD COLUMN     "usos_realizados" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usuario_id" INTEGER,
ALTER COLUMN "descuento" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "cupones" ADD CONSTRAINT "cupones_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupones" ADD CONSTRAINT "cupones_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupones" ADD CONSTRAINT "cupones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
