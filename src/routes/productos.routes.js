const express = require("express");
const productsController = require("../controllers/productos.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const router = express.Router();
const upload = require('../config/multer');

// Crear un producto (solo admin)
router.post("/", authMiddleware, adminMiddleware, productsController.createProduct);

// Obtener todos los productos activos
router.get("/", productsController.getProducts);

router.get("/admin", authMiddleware, adminMiddleware, productsController.getProductsAdmin);

// Obtener un producto por ID
router.get("/:id", productsController.getProductById);

// Actualizar un producto (solo admin)
router.put("/:id", authMiddleware, adminMiddleware, productsController.updateProduct);

// Deshabilitar un producto (en lugar de eliminarlo) (solo admin)
router.put("/:id/disable", authMiddleware, adminMiddleware, productsController.disableProduct);

router.post('/imagenes/:producto_id', uploadMiddleware.uploadMultiple, productsController.uploadProductImages);
router.get('/imagenes/:id', productsController.getImageOfProduct);
router.delete('/imagenes/:id', productsController.deleteImage);




module.exports = router;
