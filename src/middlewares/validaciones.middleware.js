const { check, validationResult } = require("express-validator");

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


const validateCreateCategory = [
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

const validateProduct = [
  check("nombre", "El nombre es obligatorio").not().isEmpty(),
  check()
];

module.exports = { validateUpdateUser, validateRegister, validateLogin, validateProduct, validateCreateCategory };
