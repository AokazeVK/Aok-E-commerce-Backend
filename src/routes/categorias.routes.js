const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const validateMiddleware = require("../middlewares/validaciones.middleware");
const categoryController = require("../controllers/categorias.controller");
const router = express.Router();


// Obtener todas las categorías activas
router.get("/activas", categoryController.getCategories); // Solo categorías activas

// Todas las categorías (solo admin)
router.get('/admin', authMiddleware, adminMiddleware, categoryController.getCategoriesAdmin); 

// Obtener una categoría por ID
router.get("/:id", categoryController.getCategoryById);

// Crear una nueva categoría (Solo Admins)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateMiddleware.validateCreateCategory,
  categoryController.createCategory
);

// Actualizar una categoría (Solo Admins)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateMiddleware.validateCreateCategory,
  categoryController.updateCategory
);

// Deshabilitar una categoría (Solo Admins)
router.put(
  "/deshabilitar/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.disableCategory
);

module.exports = router;
