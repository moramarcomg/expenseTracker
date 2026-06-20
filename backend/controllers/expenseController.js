const XLSX = require("xlsx");              // Librería para generar archivos Excel
const Expense = require("../models/Expense"); // Modelo de Mongoose para gastos

// exports.addExpense: función para crear un nuevo gasto
// req.user.id viene del middleware protect (authMiddleware)
exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    // Destructuración: extrae del body los campos que envía el frontend
    const { icon, category, amount, date } = req.body;

    // Validación: category, amount y date son obligatorios
    if (!category || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Category, amount and date are required" });
    }

    // new Expense({...}): crea una instancia del modelo (aún no guarda en BD)
    const newExpense = new Expense({
      userId,                     // userId se asigna automáticamente del token
      icon,                       // icon: string (tipo de gasto)
      category,                   // category: "Food", "Transport", "Rent", etc.
      amount,                     // amount: número (ej: 250)
      date: new Date(date),       // new Date(date): convierte string ISO a objeto Date
    });

    // newExpense.save(): guarda el documento en MongoDB (devuelve el documento guardado)
    await newExpense.save();

    // 201 = Created (recurso creado exitosamente)
    res.status(201).json(newExpense);
  } catch (error) {
    // 500 = Internal Server Error (error inesperado del servidor)
    res.status(500).json({ message: "Error adding expense", error });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    // Expense.find({ userId: req.user.id }): busca gastos del usuario autenticado
    // .sort({ date: -1 }): ordena por fecha descendente (-1 = más reciente primero)
    const expenses = await Expense.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    // req.params.id: el :id de la ruta (DELETE /api/v1/expense/:id)
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Verifica que el gasto pertenezca al usuario autenticado
    // expense.userId.toString() convierte el ObjectId a string para comparar
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // findByIdAndDelete: elimina el documento por su _id (método recomendado)
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};

// downloadExpenseExcel: genera y descarga un Excel con todos los gastos del usuario
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({
      date: -1,
    });

    // .map(): transforma cada gasto en un objeto plano para el Excel
    // .toISOString().split("T")[0]: convierte "2026-06-17T06:41:12.302Z" → "2026-06-17"
    const excelData = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    // XLSX.utils.book_new(): crea un libro de Excel vacío
    const wb = XLSX.utils.book_new();
    // XLSX.utils.json_to_sheet(): convierte un array de objetos en una hoja de Excel
    const ws = XLSX.utils.json_to_sheet(excelData);
    // book_append_sheet: agrega la hoja al libro con nombre "Expenses"
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    // writeFile: guarda el libro como archivo .xlsx en el servidor
    XLSX.writeFile(wb, "expense_details.xlsx");
    // res.download(): envía el archivo al navegador para descargarlo
    res.download("expense_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Error downloading expense excel", error });
  }
};
