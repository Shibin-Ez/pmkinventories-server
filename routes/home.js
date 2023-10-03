import express from 'express';
import { getSideBoxes, getVersion } from '../controllers/home.js';

const router = express.Router();

// READ
router.get('/', getSideBoxes);
router.get('/version', getVersion);

export default router;