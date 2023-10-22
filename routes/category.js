import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.js";

const router = express.Router();

// CREATE
router.post("/", createCategory);

// READ
router.get("/", getCategories);

// UPDATE
router.patch("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);


export default router;
