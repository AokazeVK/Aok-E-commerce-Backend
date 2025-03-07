/*
  Warnings:

  - Made the column `ciudad` on table `direcciones_envio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `codigo_postal` on table `direcciones_envio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pais` on table `direcciones_envio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "direcciones_envio" ALTER COLUMN "ciudad" SET NOT NULL,
ALTER COLUMN "codigo_postal" SET NOT NULL,
ALTER COLUMN "pais" SET NOT NULL;
