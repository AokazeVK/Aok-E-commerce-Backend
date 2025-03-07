const prisma = require("../config/prisma");

// Crear un cupón
const createCoupon = async (req, res) => {
  try {
    const { codigo, tipo_descuento, descuento, fecha_expiracion, activo, limite_uso, categoria_id, producto_id, usuario_id } = req.body;

    const nuevoCupon = await prisma.cupones.create({
      data: {
        codigo,
        tipo_descuento,
        descuento,
        fecha_expiracion,
        activo,
        limite_uso,
        categoria_id,
        producto_id,
        usuario_id
      }
    });

    res.status(201).json(nuevoCupon);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el cupón" });
  }
};

// Obtener todos los cupones
const getCoupons = async (req, res) => {
  try {
    const cupones = await prisma.cupones.findMany();
    res.json(cupones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los cupones" });
  }
};

// Obtener un cupón por ID
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const cupon = await prisma.cupones.findUnique({ where: { id: parseInt(id) } });

    if (!cupon) {
      return res.status(404).json({ error: "Cupón no encontrado" });
    }

    res.json(cupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el cupón" });
  }
};

// Actualizar un cupón
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, tipo_descuento, descuento, fecha_expiracion, activo, limite_uso, categoria_id, producto_id, usuario_id } = req.body;

    // Verificar si el cupón existe antes de actualizar
    const cuponExistente = await prisma.cupones.findUnique({ where: { id: parseInt(id) } });

    if (!cuponExistente) {
      return res.status(404).json({ error: "Cupón no encontrado" });
    }

    const cuponActualizado = await prisma.cupones.update({
      where: { id: parseInt(id) },
      data: {
        codigo,
        tipo_descuento,
        descuento,
        fecha_expiracion,
        activo,
        limite_uso,
        categoria_id,
        producto_id,
        usuario_id
      }
    });

    res.json(cuponActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el cupón" });
  }
};


// Eliminar un cupón
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el cupón existe antes de eliminar
    const cuponExistente = await prisma.cupones.findUnique({ where: { id: parseInt(id) } });

    if (!cuponExistente) {
      return res.status(404).json({ error: "Cupón no encontrado" });
    }

    await prisma.cupones.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Cupón eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el cupón" });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon
};
