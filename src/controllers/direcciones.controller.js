const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Agregar una nueva dirección
const addAddress = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { direccion, ciudad, codigo_postal, pais, predeterminada } = req.body;

    // Si se marca como predeterminada, desactivar la anterior
    if (predeterminada) {
      await prisma.direcciones_envio.updateMany({
        where: { usuario_id: usuarioId, predeterminada: true },
        data: { predeterminada: false },
      });
    }

    const nuevaDireccion = await prisma.direcciones_envio.create({
      data: { usuario_id: usuarioId, direccion, ciudad, codigo_postal, pais, predeterminada },
    });

    res.status(201).json(nuevaDireccion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar dirección', error });
  }
};

// Listar todas las direcciones de un usuario
const getAddresses = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const direcciones = await prisma.direcciones_envio.findMany({
      where: { usuario_id: usuarioId },
    });
    res.json(direcciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener direcciones', error });
  }
};

// Actualizar una dirección
const updateAddress = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;
    const { direccion, ciudad, codigo_postal, pais, predeterminada } = req.body;

    const direccionExistente = await prisma.direcciones_envio.findUnique({ where: { id: parseInt(id) } });
    if (!direccionExistente || direccionExistente.usuario_id !== usuarioId) {
      return res.status(404).json({ mensaje: 'Dirección no encontrada' });
    }

    if (predeterminada) {
      await prisma.direcciones_envio.updateMany({
        where: { usuario_id: usuarioId, predeterminada: true },
        data: { predeterminada: false },
      });
    }

    const direccionActualizada = await prisma.direcciones_envio.update({
      where: { id: parseInt(id) },
      data: { direccion, ciudad, codigo_postal, pais, predeterminada },
    });

    res.json(direccionActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar dirección', error });
  }
};

// Eliminar una dirección
const deleteAddress = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const direccionExistente = await prisma.direcciones_envio.findUnique({ where: { id: parseInt(id) } });
    if (!direccionExistente || direccionExistente.usuario_id !== usuarioId) {
      return res.status(404).json({ mensaje: 'Dirección no encontrada' });
    }

    await prisma.direcciones_envio.delete({ where: { id: parseInt(id) } });
    res.json({ mensaje: 'Dirección eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar dirección', error });
  }
};

// Marcar una dirección como predeterminada
const markAsDefaultAddress = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const direccionExistente = await prisma.direcciones_envio.findUnique({ where: { id: parseInt(id) } });
    if (!direccionExistente || direccionExistente.usuario_id !== usuarioId) {
      return res.status(404).json({ mensaje: 'Dirección no encontrada' });
    }

    await prisma.direcciones_envio.updateMany({
      where: { usuario_id: usuarioId, predeterminada: true },
      data: { predeterminada: false },
    });

    const direccionActualizada = await prisma.direcciones_envio.update({
      where: { id: parseInt(id) },
      data: { predeterminada: true },
    });

    res.json(direccionActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al marcar como predeterminada', error });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  markAsDefaultAddress,
};
