const express = require("express");
const { protect } = require("../middleware/authMiddleware");  // protect: middleware de autenticación
const upload = require("../middleware/uploadMiddleware");      // upload: middleware para subir archivos

// Destructuración: extrae registerUser, loginUser, getUserInfo del objeto exportado
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

// express.Router(): crea un enrutador independiente para agrupar rutas relacionadas
const router = express.Router();

// Definición de rutas HTTP:

// router.post("/register", registerUser)
// Cuando alguien hace POST a /api/v1/auth/register, ejecuta registerUser
router.post("/register", registerUser);
router.post("/login", loginUser);

// protect: middleware que se ejecuta ANTES de getUserInfo
// Primero verifica el token, si es válido pasa a getUserInfo
router.get("/getUser", protect, getUserInfo);

// Ruta para subir imágenes (con uploadMiddleware)
// upload.single("image"): espera un archivo en el campo "image" del formulario
// (req, res) => {}: callback inline (directo aquí, no en otro archivo)
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {  // req.file lo agrega multer automáticamente si hay archivo
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Template string (``): construye la URL de la imagen subida
  // req.protocol: http o https, req.get("host"): dominio:puerto
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});

module.exports = router;  // Exporta el router para usarlo en server.js
