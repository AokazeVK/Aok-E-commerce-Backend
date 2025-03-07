const express = require("express");
const router = express.Router();
const addressesController = require("../controllers/direcciones.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateMiddleware = require("../middlewares/validaciones.middleware");


// Obtener todas las direcciones del usuario
router.get("/", authMiddleware, addressesController.getAddresses);

// Agregar una nueva dirección
router.post("/", authMiddleware, validateMiddleware.validateAddAddress, addressesController.addAddress);

// Editar una dirección existente
router.put("/:id", authMiddleware, validateMiddleware.validateIdAddress, validateMiddleware.validateUpdateAddress, addressesController.updateAddress);

// Eliminar una dirección
router.delete("/:id/delete", authMiddleware, validateMiddleware.validateIdAddress, addressesController.deleteAddress);

// Marcar una dirección como predeterminada
router.patch("/:id/default", authMiddleware, validateMiddleware.validateIdAddress, addressesController.markAsDefaultAddress);

module.exports = router;
