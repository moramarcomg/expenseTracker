const XLSX = require("xlsx");
const Income = require("../models/Income");
const Counter = require("../models/Counter");

// exports.addIncome: función para crear un nuevo ingreso
// req.user.id viene del middleware protect (authMiddleware)
exports.addIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    // Destructuración: extrae del body los campos que envía el frontend
    const { icon, source, amount, date } = req.body;

    // Validación: source, amount y date son obligatorios
    if (!source || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Source, amount and date are required" });
    }

    // findOneAndUpdate: busca el contador "income" y lo incrementa en 1
    // upsert: true → si no existe el contador, lo crea con seq: 0
    // new: true → devuelve el documento después del incremento
    const counter = await Counter.findOneAndUpdate(
      { name: "income" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true },
    );

    const newIncome = new Income({
      userId,
      transactionId: counter.seq, // ID consecutivo: 1, 2, 3...
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();

    // 201 = Created (recurso creado exitosamente)
    res.status(201).json(newIncome);
  } catch (error) {
    // 500 = Internal Server Error (error inesperado del servidor)
    res.status(500).json({ message: "Error adding income", error });
  }
};

exports.getAllIncomes = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado
  try {
    // Income.find({ userId: req.user.id }): busca ingresos del usuario autenticado
    // .sort({ date: -1 }): ordena por fecha descendente (-1 = más reciente primero)
    // El modelo usa el campo "userId" para asociar el ingreso al usuario
    const incomes = await Income.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incomes", error });
  }
};

exports.deleteIncome = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado
  try {
    // req.params.id: el :id de la ruta (DELETE /api/v1/income/:id)
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Verifica que el ingreso pertenezca al usuario autenticado
    // income.userId.toString() convierte el ObjectId a string para comparar
    if (income.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // findByIdAndDelete: elimina el documento por su _id (método recomendado)
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
};

// downloadIncomeExcel: pendiente de implementar
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado
  try {
    const income = await Income.find({ userId: req.user.id }).sort({
      date: -1,
    });

    //Prepare data for Excel
    const excelData = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0], // Formato YYYY-MM-DD
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Error downloading income excel", error });
  }
};
