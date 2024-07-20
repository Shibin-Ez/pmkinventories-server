import express from 'express';
import { createVendor, getVendors, updateVendor } from '../controllers/vendors.js';

const router = express.Router();

// CREATE
router.post('/', createVendor);

// READ
router.get("/", getVendors);

// UPDATE
router.patch("/:id", updateVendor);

export default router;