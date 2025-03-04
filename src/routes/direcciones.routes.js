const express = require("express");
const router = express.Router();
const addressesController = require("../controllers/direcciones.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateMiddleware = require("../middlewares/validaciones.middleware");


// Obtener todas las direcciones del usuario
router.get("/direcciones", authMiddleware, addressesController.getAddresses);

// Agregar una nueva dirección
router.post("/direcciones", authMiddleware, validateMiddleware.validateAddAddress, addressesController.addAddress);

// Editar una dirección existente
router.put("/direcciones/:id", authMiddleware, validateMiddleware.validateIdAddress, validateMiddleware.validateUpdateQuantity, addressesController.updateAddress);

// Eliminar una dirección
router.delete("/direcciones/:id", authMiddleware, validateMiddleware.validateIdAddress, addressesController.deleteAddress);

// Marcar una dirección como predeterminada
router.patch("/direcciones/:id/predeterminada", authMiddleware, validateMiddleware.validateIdAddress, addressesController.markAsDefaultAddress);

module.exports = router;
