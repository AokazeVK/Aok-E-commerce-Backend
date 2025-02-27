const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const validateMiddleware = require("../middlewares/validaciones.middleware");

// Registro de usuario
router.post("/register", validateMiddleware.validateRegister, authController.register);

// Verificación de correo
router.get("/verificar/:token", authController.verificarCorreo);

//Recuperar contraseña
router.post("/recuperar-contrasena", authController.solicitarRecuperacion);
router.post("/restablecer-contrasena/:token", authController.restablecerContrasena);
// Login de usuario
router.post("/login", validateMiddleware.validateLogin, authController.login);

// Ruta protegida para obtener datos del usuario autenticado
router.get("/me", authMiddleware, authController.getUsuario);

module.exports = router;


