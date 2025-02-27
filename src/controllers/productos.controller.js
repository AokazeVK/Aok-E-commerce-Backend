const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cloudinary = require('cloudinary').v2;

// Crear un producto
const createProduct = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      precio, 
      stock, 
      marca, 
      especificaciones, 
      color, 
      peso, 
      dimensiones, 
      nuevo, 
      categoria_id 
    } = req.body;

    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre,
        descripcion,
        precio,
        stock,
        marca,
        especificaciones,
        color,
        peso,
        dimensiones,
        nuevo,
        categoria_id,
      },
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};



// Obtener todos los productos activos
const getProducts = async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      where: { activo: true }, // Solo productos activos
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};


const getProductsAdmin = async (req, res) => {
  try {
    const productos = await prisma.productos.findMany();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};





// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;

    const productoActualizado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion, precio, stock, categoria_id },
    });

    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

// Deshabilitar un producto (en lugar de eliminarlo)
const disableProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productoDeshabilitado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: { activo: false },
    });

    res.json({ message: "Producto deshabilitado", producto: productoDeshabilitado });
  } catch (error) {
    res.status(500).json({ error: "Error al deshabilitar el producto" });
  }
};

const getImageOfProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID del producto
    const imagenes = await prisma.imagenes_producto.findMany({
      where: { producto_id: parseInt(id) },
      orderBy: { orden: 'asc' } // Ordenar por el campo "orden"
    });

    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las imágenes', error });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params; // ID de la imagen

    // Obtener la imagen de la BD
    const imagen = await prisma.imagenes_producto.findUnique({ where: { id: parseInt(id) } });
    if (!imagen) {
      return res.status(404).json({ mensaje: 'Imagen no encontrada' });
    }

    // Extraer el ID de Cloudinary correctamente
    const publicId = imagen.url_imagen.split('/productos/')[1].split('.')[0];

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(`productos/${publicId}`);

    // Eliminar de la base de datos
    await prisma.imagenes_producto.delete({ where: { id: parseInt(id) } });

    res.json({ mensaje: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la imagen', error });
  }
};

const uploadProductImages = async (req, res) => {
  try {
    const { producto_id } = req.params;
    const imagenes = req.files; // Lista de imágenes subidas

    if (!producto_id || isNaN(producto_id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    if (!imagenes || imagenes.length === 0) {
      return res.status(400).json({ error: 'No se subieron imágenes' });
    }

    // Subir imágenes a Cloudinary y guardar en la base de datos
    const imagenesGuardadas = await Promise.all(
      imagenes.map(async (imagen, index) => {
        const resultado = await cloudinary.uploader.upload(imagen.path, {
          folder: 'productos', // Carpeta en Cloudinary
        });

        return await prisma.imagenes_producto.create({
          data: {
            producto_id: parseInt(producto_id),
            url_imagen: resultado.secure_url, // Guardar URL de Cloudinary
            tipo: index === 0 ? 'principal' : 'secundaria', // La primera imagen será principal
            orden: index,
          },
        });
      })
    );

    res.status(201).json({ mensaje: 'Imágenes subidas correctamente', imagenes: imagenesGuardadas });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir las imágenes', detalle: error.message });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductsAdmin,
  getProductById,
  updateProduct,
  disableProduct,
  getImageOfProduct,
  deleteImage,
  uploadProductImages
};
