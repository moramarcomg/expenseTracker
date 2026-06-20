// require: importa módulos (CommonJS, el sistema de módulos de Node.js por defecto)
const mongoose = require("mongoose");  // Mongoose: ODM para MongoDB (mapea documentos a objetos JS)

const bcrypt = require("bcryptjs");  // bcryptjs: librería para encriptar contraseñas

// new mongoose.Schema(): define la estructura (esquema) de un documento en MongoDB
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,     // Tipo de dato: String, Number, Date, Boolean, etc.
      required: true,   // required: true → campo obligatorio
    },
    email: {
      type: String,
      required: true,
      unique: true,     // unique: true → no puede haber dos usuarios con el mismo email
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: null,    // default: valor por defecto si no se proporciona
    },
  },
  { timestamps: true }, // timestamps: agrega createdAt y updatedAt automáticamente
);

// Mongoose middleware (hook): se ejecuta ANTES de guardar ("save") un documento
// "pre" significa "antes de" (pre-hook)
// async function() usa function normal (no arrow) porque necesitamos "this"
UserSchema.pre("save", async function () {
  // this: el documento que se va a guardar
  // isModified("password"): true si el campo password fue cambiado
  if (!this.isModified("password")) {
    return;  // Si la contraseña no cambió, no la encripta de nuevo
  }
  // bcrypt.hash(): encripta la contraseña con 10 rondas de salto (salt rounds)
  // 10: número de rondas (más rondas = más seguro, pero más lento)
  this.password = await bcrypt.hash(this.password, 10);
});

// methods: agrega métodos personalizados a los documentos de User
// matchPassword: compara una contraseña sin encriptar con la almacenada
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare(): compara la contraseña ingresada con la hasheada
  // Devuelve true si coinciden, false si no
  return await bcrypt.compare(enteredPassword, this.password);
};

// mongoose.model(): crea el modelo "User" basado en UserSchema
// "User" → MongoDB crea una colección llamada "users" (pluraliza automáticamente)
module.exports = mongoose.model("User", UserSchema);
