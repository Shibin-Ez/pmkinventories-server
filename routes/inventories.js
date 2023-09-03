import express from "express";
import {
  getInventory,
  getInventories,
  getInventoriesForSite,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventories.js";

const router = express.Router();

// CREATE
router.post("/", createInventory);

// READ
router.get("/", getInventories);
router.get("/:id", getInventory);
router.get("/site/:id", getInventoriesForSite);

// UPDATE
router.patch("/:id", updateInventory);

// DELETE
router.delete("/:id", deleteInventory);


export default router;