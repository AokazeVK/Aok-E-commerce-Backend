const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordenes.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const rolesMiddleware = require("../middlewares/roles.middleware");
const validateCouponMiddleware = require("../middlewares/cupon.middleware");
// Crear una orden desde el carrito
router.post("/", authMiddleware, validateCouponMiddleware, ordersController.createOrder);

// Obtener órdenes del usuario autenticado
router.get("/", authMiddleware, ordersController.getOrders);

// Obtener detalles de una orden
router.get("/:id", authMiddleware, ordersController.getOrderById);

// Actualizar estado de una orden (solo admin)
router.put("/:id", authMiddleware, rolesMiddleware.orderManagerMiddleware, ordersController.updateOrderState);

// Cancelar una orden antes de ser enviada
router.delete("/:id", authMiddleware, ordersController.cancelOrder);

module.exports = router;
