require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/usuarios.routes");
const categoriesRoutes = require("./src/routes/categorias.routes");
const productsRoutes = require("./src/routes/productos.routes");
const cartRoutes = require("./src/routes/carrito.routes");
const addressRoutes = require("./src/routes/direcciones.routes");
const couponRoutes = require("./src/routes/cupones.routes");
const app = express();
 
// Middlewares
app.use(cors());
app.use(express.json()); // Para recibir JSON en las peticiones
app.use(morgan("dev"));

//Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/categorias", categoriesRoutes);
app.use("/api/productos", productsRoutes);
app.use("/api/carrito", cartRoutes);
app.use("/api/direcciones", addressRoutes);
app.use("/api/cupones", couponRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

  
// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
