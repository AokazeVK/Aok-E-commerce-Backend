const prisma = require("../config/prisma");

const validarCuponMiddleware = async (req, res, next) => {
  try {
    const { cupon_codigo } = req.body;
    if (!cupon_codigo) return next(); // Si no hay cupón, continuar

    const cupon = await prisma.cupones.findUnique({ where: { codigo: cupon_codigo } });
    if (!cupon) return res.status(400).json({ mensaje: "Cupón inválido" });
    if (!cupon.activo) return res.status(400).json({ mensaje: "Este cupón no está activo" });
    if (new Date(cupon.fecha_expiracion) < new Date()) return res.status(400).json({ mensaje: "El cupón ha expirado" });

    // Verificar uso único
    if (cupon.uso_unico) {
      const cuponUsado = await prisma.ordenes.findFirst({
        where: { usuario_id: req.usuario.id, cupon_codigo },
      });
      if (cuponUsado) return res.status(400).json({ mensaje: "Ya has utilizado este cupón" });
    }

    req.cupon = cupon;
    next();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al validar cupón", error });
  }
};

module.exports = validarCuponMiddleware;