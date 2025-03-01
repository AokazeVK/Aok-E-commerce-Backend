const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
      if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: "No tienes permisos para realizar esta acción" });
      }
      next();
    };
  };
  
  const adminMiddleware = verificarRol(["admin"]);
  const productManagerMiddleware = verificarRol(["admin", "gestor_productos"]);
  const orderManagerMiddleware = verificarRol(["admin", "gestor_pedidos"]);
  const customerServiceMiddleware = verificarRol(["admin", "atencion_cliente"]);
  
  module.exports = { adminMiddleware, productManagerMiddleware, orderManagerMiddleware, customerServiceMiddleware };
  