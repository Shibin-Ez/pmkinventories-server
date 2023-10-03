import express from 'express';
import { getSite, getSites, createSite, updateSite, deleteSite, downloadSitePdf } from '../controllers/sites.js';

const router = express.Router();

// CREATE
router.post('/', createSite);

// READ
router.get('/', getSites);
router.get('/site/:id', getSite);
router.get('/download', downloadSitePdf);

// UPDATE
router.patch('/:id', updateSite);

// DELETE
router.delete('/:id', deleteSite);

export default router;