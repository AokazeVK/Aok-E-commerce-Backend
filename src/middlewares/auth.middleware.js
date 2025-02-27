const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. No hay token" });
  }

  // Si el token comienza con "Bearer ", lo eliminamos
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardamos los datos del usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = authMiddleware;