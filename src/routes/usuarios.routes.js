const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const usersController = require("../controllers/usuarios.controller");
const validateMiddleware = require("../middlewares/validaciones.middleware");
const router = express.Router();
const rolesMiddleware = require("../middlewares/roles.middleware");

// Obtener todos los usuarios (solo Admin)
router.get("/", authMiddleware, rolesMiddleware.adminMiddleware, usersController.getUsers);

//Obtener usuario
router.get("/perfil", authMiddleware, usersController.getUser);

//Modificar usuario
router.put("/perfil", authMiddleware, validateMiddleware.validateUpdateUser, usersController.updateUser);

//Eliminar usuario
router.delete("/perfil", authMiddleware, rolesMiddleware.adminMiddleware, usersController.deleteUser);

module.exports = router;