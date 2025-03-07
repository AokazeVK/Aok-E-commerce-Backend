const prisma = require("../config/prisma");

const validarCheckoutMiddleware = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    // Verificar que el usuario tenga productos en el carrito
    const carrito = await prisma.carrito.findUnique({
      where: { usuario_id: usuarioId },
      include: { items: { include: { producto: true } } },
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ mensaje: "El carrito está vacío" });
    }

    // Verificar stock de productos
    for (const item of carrito.items) {
      if (!item.producto || !item.producto.activo) {
        return res.status(400).json({ mensaje: `El producto ${item.producto_id} no está disponible` });
      }
      if (item.cantidad > item.producto.stock) {
        return res.status(400).json({ mensaje: `Stock insuficiente para el producto ${item.producto.nombre}` });
      }
    }

    // Buscar dirección predeterminada del usuario
    const direccion = await prisma.direcciones_envio.findFirst({
      where: { usuario_id: usuarioId, predeterminada: true },
    });

    if (!direccion) {
      return res.status(400).json({ mensaje: "Debes seleccionar una dirección de envío" });
    }

    req.direccion_id = direccion.id; // Pasar la dirección al controlador
    next();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al validar la orden", error });
  }
};

module.exports = validarCheckoutMiddleware;
