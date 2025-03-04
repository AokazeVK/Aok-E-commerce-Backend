const { check, body, param, validationResult } = require("express-validator");
//const prisma = require("../config/prisma"); // Ajusta según la ubicación de tu instancia de Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware para validar resultados
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};


// Validaciones para registro de usuario
const validateRegister = [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es una cadena").optional(),
    check("correo", "Debe ser un correo válido").isEmail(),
    check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
    check("telefono", "El telefono es una cadena").optional(),
    check("rol", "El rol debe ser cliente, vendedor o admin").optional().isIn(["cliente", "vendedor", "admin"]),
    validarCampos, // Middleware para manejar errores
  ];

// Validaciones para login de usuario
const validateLogin = [
    check("correo", "Debe ser un correo válido").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos, // Middleware para manejar errores
  ]; 

// Validaciones para actualizar perfil
const validateUpdateUser = [
  check("nombre", "El nombre debe tener entre 2 y 100 caracteres")
    .optional()
    .isLength({ min: 2, max: 100 }),
  check("apellido", "El apellido debe tener entre 2 y 100 caracteres")
    .optional()
    .isLength({ min: 2, max: 100 }),
  check("telefono", "El teléfono debe ser un número válido")
    .optional()
    .isNumeric()
    .isLength({ min: 7, max: 20 }),
  validarCampos,
];

// Validaciones para crear categorias
const validateCategory = [
  check("nombre", "El nombre es obligatorio").not().isEmpty(),
  check("descripcion", "La descripción debe ser una cadena").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  },
];

// Validaciones para crear productos
const validateProduct = [
  check("nombre", "El nombre es obligatorio y debe tener entre 3 y 255 caracteres")
      .not().isEmpty()
      .isLength({ min: 3, max: 255 }),

  check("descripcion", "La descripción debe ser una cadena").optional().isString(),

  check("precio", "El precio debe ser un número decimal positivo")
      .isDecimal()
      .toFloat()
      .custom(value => value > 0),

  check("stock", "El stock debe ser un número entero no negativo")
      .isInt({ min: 0 }),

  check("estado_stock", "El estado del stock debe ser 'disponible', 'agotado', o 'bajo'")
      .optional()
      .isIn(["disponible", "agotado", "bajo"]),

  check("categoria_id", "El ID de la categoría debe ser un número entero").optional().isInt(),

  check("marca", "La marca debe ser una cadena").optional().isString().isLength({ max: 100 }),

  check("especificaciones", "Las especificaciones deben ser una cadena").optional().isString(),

  check("color", "El color debe ser una cadena").optional().isString().isLength({ max: 50 }),

  check("peso", "El peso debe ser una cadena").optional().isString().isLength({ max: 50 }),

  check("dimensiones", "Las dimensiones deben ser una cadena").optional().isString(),

  check("nuevo", "El campo 'nuevo' debe ser un booleano").optional().isBoolean(),

  check("activo", "El campo 'activo' debe ser un booleano").isBoolean(),

  validarCampos, // Middleware para manejar errores
];

// Función auxiliar para validar productos
const validarProducto = async (producto_id, cantidad, req, res, next) => {
    try {
        const producto = await prisma.productos.findUnique({ where: { id: producto_id } });
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Verificar si el producto está activo
        if (!producto.activo) {
            return res.status(400).json({ mensaje: "El producto no está activo y no se puede agregar al carrito." });
        }

        if (cantidad > producto.stock) {
            return res.status(400).json({ mensaje: `Solo hay ${producto.stock} unidades disponibles.` });
        }

        req.producto = producto;
        next();
    } catch (error) {
        res.status(500).json({ mensaje: "Error al validar el producto", error });
    }
};

// Validaciones para agregar al carrito
const validateCart = [
    body("producto_id")
        .isInt({ min: 1 })
        .withMessage("El ID del producto debe ser un número entero positivo"),
    body("cantidad")
        .isInt({ min: 1 })
        .withMessage("La cantidad debe ser un número entero mayor a 0"),
    async (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        const { producto_id, cantidad } = req.body;
        await validarProducto(producto_id, cantidad, req, res, next);
    },
];

// Validacion para actualizar elcarrito
const validateUpdateQuantity = [
    param("producto_id")
        .isInt({ min: 1 })
        .withMessage("El ID del producto debe ser un número entero positivo"),
    body("cantidad")
        .isInt({ min: 1 })
        .withMessage("La cantidad debe ser un número entero mayor a 0"),
    async (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        const { cantidad } = req.body;
        const producto_id = parseInt(req.params.producto_id);
        await validarProducto(producto_id, cantidad, req, res, next);
    },
];

// Validaciones para agregar una nueva dirección
const validateAddAddress = [
  body("direccion").notEmpty().withMessage("La dirección es obligatoria"),
  body("ciudad").optional().isString().withMessage("La ciudad debe ser un texto"),
  body("codigo_postal").optional().isString().withMessage("El código postal debe ser un texto"),
  body("pais").notEmpty().withMessage("El país es obligatorio"),
  body("predeterminada").optional().isBoolean().withMessage("El valor de predeterminada debe ser booleano"),
  validarCampos,
];

// Validaciones para editar una dirección existente
const validateUpdateAddress = [
  param("id").isInt().withMessage("El ID debe ser un número entero"),
  body("direccion").notEmpty().withMessage("La dirección es obligatoria"),
  body("ciudad").optional().isString().withMessage("La ciudad debe ser un texto"),
  body("codigo_postal").optional().isString().withMessage("El código postal debe ser un texto"),
  body("pais").notEmpty().withMessage("El país es obligatorio"),
  body("predeterminada").optional().isBoolean().withMessage("El valor de predeterminada debe ser booleano"),
  validarCampos,
];

// Validaciones para ID de dirección
const validateIdAddress = [
  param("id").isInt().withMessage("El ID debe ser un número entero"),
  validarCampos,
];


module.exports = { validateUpdateUser, validateRegister, validateLogin, validateProduct, validateCategory, validateCart, validateUpdateQuantity ,validateAddAddress, validateUpdateAddress, validateIdAddress,  };
