/*
  Warnings:

  - Made the column `producto_id` on table `imagenes_producto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "imagenes_producto" ALTER COLUMN "producto_id" SET NOT NULL;
