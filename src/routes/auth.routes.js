const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const validateMiddleware = require("../middlewares/validaciones.middleware");


// Registro e inicio de sesión
router.post("/registro",validateMiddleware.validateRegister, authController.register);
router.post("/login", validateMiddleware.validateLogin, authController.login);

// Verificación de correo y recuperación de contraseña
router.get("/verificar/:token", authController.verifyEmail);
router.post("/recuperar", authController.forgotPassword);
router.post("/restablecer/:token", authController.resetPassword);

// Ruta protegida para obtener datos del usuario autenticado
router.get("/me", authMiddleware, authController.getUser);

module.exports = router;


