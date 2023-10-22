import express from "express";
import {
  getInventory,
  getInventories,
  getInventoriesForSite,
  createInventory,
  updateInventory,
  deleteInventory,
  downloadInventoryPdf,
  getInventoriesByCategory,
} from "../controllers/inventories.js";

const router = express.Router();

// CREATE
router.post("/", createInventory);

// READ
router.get("/", getInventories);
router.get("/inventory/:id", getInventory);
router.get("/site/:id", getInventoriesForSite);
router.get("/download", downloadInventoryPdf);
router.get("/category/:id", getInventoriesByCategory);

// UPDATE
router.patch("/:id", updateInventory);

// DELETE
router.delete("/:id", deleteInventory);


export default router;