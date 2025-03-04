const express = require("express");
const productsController = require("../controllers/productos.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const rolesMiddleware = require("../middlewares/roles.middleware");
const validateMiddleware = require("../middlewares/validaciones.middleware");
const router = express.Router();


// CRUD de productos (solo Admin y Product Manager)
router.post("/", authMiddleware, validateMiddleware.validateProduct, rolesMiddleware.productManagerMiddleware, productsController.createProduct);
router.put("/:id", authMiddleware,validateMiddleware.validateProduct, rolesMiddleware.productManagerMiddleware, productsController.updateProduct);
router.put("/:id/disable", authMiddleware, rolesMiddleware.productManagerMiddleware, productsController.disableProduct);
router.get("/admin", authMiddleware, rolesMiddleware.productManagerMiddleware, productsController.getProductsAdmin);

// Obtener productos (público)
router.get("/", productsController.getProducts);
router.get("/:id", productsController.getProductById);
router.get("/imagenes/:id", productsController.getImageOfProduct);

// Gestión de imágenes de productos (solo Admin y Product Manager)
router.post("/imagenes/:producto_id", uploadMiddleware, authMiddleware, rolesMiddleware.productManagerMiddleware, productsController.uploadProductImages);
router.delete("/imagenes/:producto_id/:id", authMiddleware, rolesMiddleware.productManagerMiddleware, productsController.deleteImage);




module.exports = router;
