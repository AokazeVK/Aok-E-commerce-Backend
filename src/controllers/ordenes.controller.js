const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Crear orden a partir del carrito
const createOrder = async (req, res) => {
    try {
      const usuarioId = req.usuario.id;
      const { direccion_id, cupon_codigo } = req.body;
  
      // Verificar si el carrito tiene productos
      const carrito = await prisma.carrito.findUnique({
        where: { usuario_id: usuarioId },
        include: { items: { include: { producto: true } } },
      });
      if (!carrito || carrito.items.length === 0) {
        return res.status(400).json({ mensaje: 'El carrito está vacío' });
      }
  
      // Verificar que la dirección existe y pertenece al usuario
      const direccion = await prisma.direcciones_envio.findUnique({
        where: { id: direccion_id, usuario_id: usuarioId },
      });
      if (!direccion) {
        return res.status(404).json({ mensaje: 'Dirección de envío no válida' });
      }
  
      // Calcular total
      let total = carrito.items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  
      // Aplicar cupón si existe
      if (cupon_codigo) {
        const cupon = await prisma.cupones.findUnique({ where: { codigo: cupon_codigo } });
        if (cupon && cupon.activo) {
          total = total - (total * cupon.descuento / 100);
        }
      }
  
      // Crear la orden
      const orden = await prisma.ordenes.create({
        data: {
          usuario_id: usuarioId,
          direccion_envio_id: direccion_id,
          total,
          estado: 'pendiente de pago',
          items: {
            create: carrito.items.map(item => ({
              producto_id: item.producto_id,
              cantidad: item.cantidad,
              precio: item.producto.precio,
            })),
          },
        },
      });
  
      // Vaciar el carrito después de crear la orden
      await prisma.carrito_item.deleteMany({ where: { carrito_id: carrito.id } });
  
      res.status(201).json({ mensaje: 'Orden creada exitosamente', orden });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear la orden', error });
    }
  };
  
  // Cancelar una orden
  const cancelOrder = async (req, res) => {
    try {
      const { orden_id } = req.params;
      const usuarioId = req.usuario.id;
  
      const orden = await prisma.ordenes.findUnique({ where: { id: parseInt(orden_id), usuario_id: usuarioId } });
      if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
  
      if (orden.estado !== 'pendiente de pago') {
        return res.status(400).json({ mensaje: 'Solo puedes cancelar órdenes antes de ser enviadas' });
      }
  
      await prisma.ordenes.update({ where: { id: orden.id }, data: { estado: 'cancelado' } });
      res.json({ mensaje: 'Orden cancelada correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al cancelar la orden', error });
    }
  };
  
  // Obtener órdenes del usuario
  const getOrders = async (req, res) => {
    try {
      const usuarioId = req.usuario.id;
      const ordenes = await prisma.ordenes.findMany({
        where: { usuario_id: usuarioId },
        include: { items: true, direccion_envio: true },
      });
      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener órdenes', error });
    }
  };

  // Obtener una orden por ID
const getOrderById = async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.usuario.id;
  
      const orden = await prisma.ordenes.findUnique({
        where: { id: parseInt(id) },
        include: {
          items: {
            include: {
              producto: true,
            },
          },
          direccion_envio: true,
        },
      });
  
      if (!orden) {
        return res.status(404).json({ mensaje: "Orden no encontrada" });
      }
  
      // Validar que la orden pertenece al usuario o que es un admin
      if (orden.usuario_id !== usuarioId && req.usuario.rol !== "admin") {
        return res.status(403).json({ mensaje: "No tienes permisos para ver esta orden" });
      }
  
      res.json(orden);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener la orden", error });
    }
  };
  
  // Actualizar estado de una orden (solo admin o order manager)
  const updateOrderState = async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
  
      // Estados válidos
      const estadosValidos = ["pendiente de pago", "pago recibido", "en preparación", "enviado", "entregado", "cancelado"];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ mensaje: "Estado no válido" });
      }
  
      const orden = await prisma.ordenes.findUnique({ where: { id: parseInt(id) } });
      if (!orden) {
        return res.status(404).json({ mensaje: "Orden no encontrada" });
      }
  
      // Si la orden ya fue enviada, no se puede cancelar
      if (orden.estado === "enviado" || orden.estado === "entregado") {
        return res.status(400).json({ mensaje: "No se puede modificar una orden enviada o entregada" });
      }
  
      await prisma.ordenes.update({
        where: { id: parseInt(id) },
        data: { estado },
      });
  
      res.json({ mensaje: `Estado de la orden actualizado a ${estado}` });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar el estado de la orden", error });
    }
  };
  
  
  module.exports = { createOrder, cancelOrder, getOrders, getOrderById, updateOrderState };