-- AlterTable
ALTER TABLE "categorias" ADD COLUMN     "categoria_padre_id" INTEGER;

-- CreateIndex
CREATE INDEX "categorias_categoria_padre_id_idx" ON "categorias"("categoria_padre_id");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoria_padre_id_fkey" FOREIGN KEY ("categoria_padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
