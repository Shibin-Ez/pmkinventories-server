import express from 'express';
import { createMaterial, getMaterials, updateMaterial } from '../controllers/materials.js';

const router = express.Router();

// CREATE
router.post('/', createMaterial);

// READ
router.get("/", getMaterials);

// UPDATE
router.patch("/:id", updateMaterial);


export default router;