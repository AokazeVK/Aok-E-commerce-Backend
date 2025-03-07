const express = require("express");
const router = express.Router();
const couponsController = require("../controllers/cupones.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolesMiddleware = require("../middlewares/roles.middleware");

// Crear un cupón (solo admin)
router.post("/", authMiddleware, rolesMiddleware.adminMiddleware, couponsController.createCoupon);

// Obtener todos los cupones (solo admin)
router.get("/", authMiddleware, rolesMiddleware.adminMiddleware, couponsController.getCoupons);

// Obtener un cupón por ID (solo admin)
router.get("/:id", authMiddleware, rolesMiddleware.adminMiddleware, couponsController.getCouponById);

// Actualizar un cupón (solo admin)
router.put("/:id", authMiddleware, rolesMiddleware.adminMiddleware, couponsController.updateCoupon);

// Eliminar un cupón (solo admin)
router.delete("/:id", authMiddleware, rolesMiddleware.adminMiddleware, couponsController.deleteCoupon);

module.exports = router;
