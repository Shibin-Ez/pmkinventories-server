import express from "express";
import {
  getStocks,
  getStock,
  getStocksBySites,
  createStock,
  updateStock,
  rollback,
} from "../controllers/stocks.js";

const router = express.Router();

// CREATE
router.post("/:id", createStock);

// READ
router.get("/", getStocks);
router.get("/:id", getStock);
router.get("/reports/sitewise", getStocksBySites)

// UPDATE
router.put("/:id", updateStock);
router.patch("/:id/rollback", rollback);


export default router;