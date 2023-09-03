import express from 'express';
import { getSite, getSites, createSite, updateSite, deleteSite } from '../controllers/sites.js';

const router = express.Router();

// CREATE
router.post('/', createSite);

// READ
router.get('/', getSites);
router.get('/:id', getSite);

// UPDATE
router.patch('/:id', updateSite);

// DELETE
router.delete('/:id', deleteSite);

export default router;