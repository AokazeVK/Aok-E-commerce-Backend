const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const usuariosController = require("../controllers/usuarios.controller");
const validacionesMiddleware = require("../middlewares/validaciones.middleware");
const router = express.Router();

//Obtener usuario
router.get("/perfil", authMiddleware, usuariosController.getUsuario);

//Modificar usuario
router.put("/perfil", authMiddleware, validacionesMiddleware.validarUpdateUsuario, usuariosController.updateUsuario);

//Eliminar usuario
router.delete("/perfil", authMiddleware, usuariosController.deleteUsuario);

module.exports = router;