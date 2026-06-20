const mongoose = require("mongoose");  // Mongoose: ODM para MongoDB

// new mongoose.Schema(): define la estructura del documento "Income" en MongoDB
const incomeSchema = new mongoose.Schema(
  {
    userId: {
      // mongoose.Schema.Types.ObjectId: tipo especial para referenciar otro documento
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // ref: "User" → se relaciona con la colección "users"
      required: true,    // Todo ingreso debe pertenecer a un usuario
    },
    icon: { type: String },           // Icono representativo (opcional)
    amount: { type: Number, required: true },  // Número (con decimales si aplica)
    source: { type: String, required: true },  // Ej: "Salary", "Freelance", "Investments"
    date: { type: Date, default: Date.now },   // Date.now: fecha actual por defecto
  },
  { timestamps: true },  // timestamps: agrega createdAt y updatedAt automáticamente
);

// mongoose.model(): crea el modelo "Income" basado en incomeSchema
// MongoDB crea una colección llamada "incomes" (pluraliza automáticamente)
module.exports = mongoose.model("Income", incomeSchema);
