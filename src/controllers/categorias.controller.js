const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear categoría o subcategoría
const createCategory = async (req, res) => {
  const { nombre, descripcion, categoria_padre_id } = req.body;
  
  try {
    const nuevaCategoria = await prisma.categorias.create({
      data: {
        nombre,
        descripcion,
        categoria_padre_id: categoria_padre_id || null,
      },
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

// Obtener todas las categorías y subcategorías
const getCategories = async (req, res) => {
  try {
    const categorias = await prisma.categorias.findMany({
      where: { categoria_padre_id: null, activo: true }, // Solo categorías principales activas
      include: {
        subcategorias: {
          where: { activo: true }, // Solo subcategorías activas
          include: {
            subcategorias: {
              where: { activo: true }, // Subcategorías de subcategorías activas
            },
          },
        },
      },
    });

    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

// Obtener Categorias solo administrador
const getCategoriesActives = async (req, res) => {
  try {
    const categorias = await prisma.categorias.findMany({
      where: { categoria_padre_id: null }, // Solo categorías principales
      include: {
        subcategorias: {
          include: {
            subcategorias: true, // Subcategorías anidadas
          },
        },
      },
    });

    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};





// Obtener una categoría por ID con sus subcategorías
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categorias.findUnique({
      where: { id: parseInt(id) },
      include: { subcategorias: true },
    });
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
};

// Actualizar categoría
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria_padre_id } = req.body;
  try {
    const categoriaActualizada = await prisma.categorias.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion, categoria_padre_id },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};
 
// Deshabilitar Categoria
const disableCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await prisma.categorias.update({
      where: { id: parseInt(id) },
      data: { activo: false }, // Marcar como inactiva
    });

    res.json({ mensaje: "Categoría deshabilitada correctamente", categoria });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoriesActives,
  getCategoryById,
  updateCategory,
  disableCategory,
};
