const multer = require("multer");  // Multer: middleware para manejar archivos en formularios

// multer.diskStorage(): configura dónde y cómo guardar los archivos subidos
const storage = multer.diskStorage({
  // destination: carpeta donde se guardan los archivos
  destination: function (req, file, cb) {
    // cb(null, "uploads/") → cb es "callback", null = no hay error, "uploads/" = carpeta destino
    cb(null, "uploads/");
  },
  // filename: nombre con el que se guarda el archivo
  filename: function (req, file, cb) {
    // Date.now(): timestamp actual (para evitar nombres duplicados)
    // Math.round(Math.random() * 1e9): número aleatorio de 9 dígitos
    // file.originalname: nombre original del archivo del usuario
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

// fileFilter: función que valida qué tipos de archivo se permiten
const fileFilter = (req, file, cb) => {
  // allowedTypes: array con los MIME types permitidos
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  // .includes(): verifica si file.mimetype está en el array
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // true = acepta el archivo
  } else {
    // Error: rechaza el archivo con un mensaje
    cb(
      new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."),
      false,  // false = no acepta el archivo
    );
  }
};

// multer({ storage, fileFilter }): crea el middleware con la configuración
// Shorthand property: { storage, fileFilter } es igual a { storage: storage, fileFilter: fileFilter }
const upload = multer({ storage, fileFilter });

module.exports = upload;
