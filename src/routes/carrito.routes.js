const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carrito.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateMiddleware = require("../middlewares/validaciones.middleware");

// Obtener el carrito del usuario autenticado
router.get("/", authMiddleware, cartController.getCarrito);

// Agregar un producto al carrito
router.post("/agregar", authMiddleware, validateMiddleware.validateCart, cartController.addToCarrito);

// Actualizar la cantidad de un producto en el carrito
router.put("/actualizar/:producto_id", authMiddleware, validateMiddleware.validateUpdateQuantity, cartController.updateCarritoItem);

// Eliminar un producto del carrito
router.delete("/eliminar/:producto_id", authMiddleware, cartController.removeFromCarrito);

// Vaciar el carrito completamente
router.delete("/vaciar", authMiddleware, cartController.clearCarrito);


module.exports = router;
