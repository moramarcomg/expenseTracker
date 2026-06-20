const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "income" o "expense"
  seq: { type: Number, default: 0 },                    // Último número usado
});

module.exports = mongoose.model("Counter", counterSchema);
