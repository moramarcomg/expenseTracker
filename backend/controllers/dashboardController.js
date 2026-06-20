const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// exports.getDashboardData: devuelve resumen de ingresos, gastos y balance
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId); // Convierte string a ObjectId para consultas
    // Promise.all: ejecuta varias promesas en paralelo (más rápido que una por una)
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("Total Income:", {
      totalIncome,
      userId: isValidObjectId(userId),
    });

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    // .reduce(): suma todos los montos de los ingresos
    // Si no hay ingresos, devuelve 0 (reduce con valor inicial 0)

    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }, // Últimos 60 días
    }).sort({ date: -1 }); // Ordena por fecha descendente (más reciente primero)

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Últimos 30 días
    }).sort({ date: -1 }); // Ordena por fecha descendente (más reciente primero)

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    const lastTransactions = [
      ...(
        await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((txn) => ({
        ...txn.toObject(),
        type: "income",
      })),
      ...(
        await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((txn) => ({ ...txn.toObject(), type: "expense" })),
    ]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5); // Ordena por fecha descendente y toma los últimos 5

    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};
