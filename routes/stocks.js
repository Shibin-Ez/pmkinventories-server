import express from "express";
import {
  getStocks,
  getStock,
  getStocksBySites,
  createStock,
  updateStock,
  rollback,
  downloadReportPdf,
  getStocksBySite,
  downloadSingleSiteReport,
  getStocksByInventories,
  downloadReportItemwise,
} from "../controllers/stocks.js";

const router = express.Router();

// CREATE
router.post("/:id", createStock);

// READ
router.get("/", getStocks);
router.get("/:id", getStock);
router.get("/site/:id", getStocksBySite);
router.get("/site/:id/download", downloadSingleSiteReport);
router.get("/reports/sitewise", getStocksBySites);
router.get("/reports/sitewise/download", downloadReportPdf);
router.get("/reports/itemwise", getStocksByInventories);
router.get("/reports/itemwise/download", downloadReportItemwise);

// UPDATE
router.put("/:id", updateStock);
router.patch("/:id/rollback", rollback);


export default router;