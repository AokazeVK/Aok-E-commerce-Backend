const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const validateMiddleware = require("../middlewares/validaciones.middleware");
const categoryController = require("../controllers/categorias.controller");
const router = express.Router();
const rolesMiddleware = require("../middlewares/roles.middleware");


// CRUD de categorías y subcategorías (Admin y Gestor de Productos)
router.post("/", authMiddleware, rolesMiddleware.productManagerMiddleware, validateMiddleware.validateCategory, categoryController.createCategory);
router.put("/:id", authMiddleware, rolesMiddleware.productManagerMiddleware,  validateMiddleware.validateCategory, categoryController.updateCategory);
router.put("/:id/disable", authMiddleware, rolesMiddleware.productManagerMiddleware, categoryController.disableCategory);
router.get('/activos', authMiddleware, rolesMiddleware.productManagerMiddleware, categoryController.getCategoriesActives); 

// Obtener categorías y subcategorías (cualquier usuario puede verlas)
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
