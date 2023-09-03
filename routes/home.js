import express from 'express';
import { getSideBoxes } from '../controllers/home.js';

const router = express.Router();

// READ
router.get('/', getSideBoxes);

export default router;