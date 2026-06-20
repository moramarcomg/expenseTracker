const express = require("express");
const {
  addIncome,
  getAllIncomes,
  updateIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addIncome);
router.get("/", protect, getAllIncomes);
router.put("/:id", protect, updateIncome);
router.delete("/:id", protect, deleteIncome);
router.get("/download/excel", protect, downloadIncomeExcel);
