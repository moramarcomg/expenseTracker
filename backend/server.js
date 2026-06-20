// require("dotenv").config(): carga las variables del archivo .env a process.env
require("dotenv").config();
const express = require("express"); // Express: framework para crear servidores HTTP
const cors = require("cors"); // CORS: permite que el frontend (otro dominio) haga peticiones
const path = require("path"); // path: módulo nativo de Node para manejar rutas de archivos
const connectDB = require("./config/db"); // connectDB: función que conecta a MongoDB
const authRoutes = require("./routes/authRoutes"); // Importa las rutas de autenticación
const incomeRoutes = require("./routes/incomeRoutes"); // Importa las rutas de ingresos
const expenseRoutes = require("./routes/expenseRoutes"); // Importa las rutas de gastos
const dashboardRoutes = require("./routes/dashboardRoutes"); // Importa las rutas del dashboard

// app = express(): crea la aplicación servidor
const app = express();

// app.use(): monta middleware (funciones que procesan las peticiones antes de llegar a las rutas)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // "*" permite cualquier origen (solo para desarrollo)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// express.json(): convierte el body de las peticiones de JSON a objeto JavaScript (req.body)
app.use(express.json());

connectDB(); // Conecta a MongoDB al iniciar el servidor

// Monta las rutas en /api/v1/auth (ej: /api/v1/auth/register, /api/v1/auth/login)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// express.static(): sirve archivos estáticos (imágenes subidas) desde la carpeta /uploads
// path.join(__dirname, "uploads"): construye la ruta absoluta a la carpeta uploads
// __dirname: variable global de Node que contiene la ruta del archivo actual
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// process.env.PORT: lee del .env, si no existe usa 5000 como fallback
const PORT = process.env.PORT || 5000;
// app.listen(): inicia el servidor y escucha en el puerto especificado
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
