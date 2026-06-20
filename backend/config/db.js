const mongoose = require("mongoose");  // Mongoose: ODM para MongoDB (facilita las consultas)

const connectDB = async () => {  // async: función asíncrona porque mongoose.connect devuelve una promesa
  try {
    // mongoose.connect(): conecta a MongoDB usando la URI del .env
    // process.env.MONGO_URI: lee la variable de entorno definida en .env
    await mongoose.connect(process.env.MONGO_URI, {});  // await: espera a que la conexión termine
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);  // process.exit(1): termina el proceso con código de error (1 = error)
  }
};

module.exports = connectDB;  // Exporta la función para usarla en server.js
