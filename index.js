require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./src/routes/auth.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const app = express();
 
// Middlewares
app.use(cors());
app.use(express.json()); // Para recibir JSON en las peticiones
app.use(morgan("dev"));

//Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

  
// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
