-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "color" VARCHAR(50),
ADD COLUMN     "dimensiones" TEXT,
ADD COLUMN     "especificaciones" TEXT,
ADD COLUMN     "marca" VARCHAR(100),
ADD COLUMN     "nuevo" BOOLEAN DEFAULT true,
ADD COLUMN     "peso" DECIMAL(10,2);
