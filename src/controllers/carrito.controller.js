const prisma = require("../config/prisma");
// Función auxiliar para calcular el total del carrito
const calcularTotalCarrito = async (carritoId) => {
    const items = await prisma.carrito_item.findMany({
        where: { carrito_id: carritoId },
        include: { producto: true },
    });

    let total = 0;
    for (const item of items) {
        total += parseFloat(item.producto.precio) * item.cantidad;
    }

    return total.toFixed(2); // Formatear el total a dos decimales
};

// Obtener el carrito del usuario
const getCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const carrito = await prisma.carrito.findUnique({
            where: { usuario_id: usuarioId },
            include: { items: { include: { producto: true } } },
        });

        if (!carrito) {
            return res.json({ mensaje: "Carrito vacío", items: [] });
        }

        res.json(carrito);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el carrito", error });
    }
};

// Agregar un producto al carrito
const addToCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { producto_id, cantidad } = req.body;
        const producto = req.producto; // Lo obtenemos del middleware

        let carrito = await prisma.carrito.findUnique({ where: { usuario_id: usuarioId } });
        if (!carrito) {
            carrito = await prisma.carrito.create({ data: { usuario_id: usuarioId } });
        }

        const itemExistente = await prisma.carrito_item.findFirst({
            where: { carrito_id: carrito.id, producto_id },
        });

        if (itemExistente) {
            const nuevaCantidad = itemExistente.cantidad + cantidad;

            if (nuevaCantidad > producto.stock) {
                return res.status(400).json({ mensaje: `No puedes agregar más de ${producto.stock} unidades.` });
            }

            await prisma.carrito_item.update({
                where: { id: itemExistente.id },
                data: { cantidad: nuevaCantidad },
            });
        } else {
            await prisma.carrito_item.create({
                data: { carrito_id: carrito.id, producto_id, cantidad },
            });
        }

        // Calcular y actualizar el total del carrito
        const nuevoTotal = await calcularTotalCarrito(carrito.id);
        await prisma.carrito.update({ where: { id: carrito.id }, data: { total: nuevoTotal } });

        res.json({ mensaje: "Producto agregado al carrito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar producto", error });
    }
};

// Actualizar cantidad de un producto en el carrito
const updateCarritoItem = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const producto_id = parseInt(req.params.producto_id);
        const { cantidad } = req.body;
        const producto = req.producto; // Lo obtenemos del middleware

        const carrito = await prisma.carrito.findUnique({ where: { usuario_id: usuarioId } });
        if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

        const item = await prisma.carrito_item.findFirst({
            where: { carrito_id: carrito.id, producto_id },
        });

        if (!item) {
            return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
        }

        await prisma.carrito_item.update({
            where: { id: item.id },
            data: { cantidad },
        });

        // Calcular y actualizar el total del carrito
        const nuevoTotal = await calcularTotalCarrito(carrito.id);
        await prisma.carrito.update({ where: { id: carrito.id }, data: { total: nuevoTotal } });

        res.json({ mensaje: "Cantidad actualizada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar producto", error });
    }
};

// Eliminar un producto del carrito
const removeFromCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { producto_id } = req.params;

        const carrito = await prisma.carrito.findUnique({ where: { usuario_id: usuarioId } });
        if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

        await prisma.carrito_item.deleteMany({
            where: { carrito_id: carrito.id, producto_id: parseInt(producto_id) },
        });

        // Calcular y actualizar el total del carrito
        const nuevoTotal = await calcularTotalCarrito(carrito.id);
        await prisma.carrito.update({ where: { id: carrito.id }, data: { total: nuevoTotal } });

        res.json({ mensaje: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar producto", error });
    }
};

// Vaciar el carrito
const clearCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const carrito = await prisma.carrito.findUnique({ where: { usuario_id: usuarioId } });
        if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

        await prisma.carrito_item.deleteMany({ where: { carrito_id: carrito.id } });

        // Actualizar el total del carrito a 0
        await prisma.carrito.update({ where: { id: carrito.id }, data: { total: "0" } });

        res.json({ mensaje: "Carrito vaciado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al vaciar carrito", error });
    }
};

module.exports = { getCarrito, addToCarrito, updateCarritoItem, removeFromCarrito, clearCarrito };