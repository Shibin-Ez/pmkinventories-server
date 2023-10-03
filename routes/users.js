import express from 'express';
import { getUsers, getUser, createUser, updateUser, downloadUsersPdf } from '../controllers/users.js';

const router = express.Router();

// CREATE
router.post('/', createUser);

// READ
router.get('/', getUsers);
router.get('/user/:id', getUser);
router.get('/download', downloadUsersPdf);

// UPDATE
router.patch('/:id', updateUser);


export default router;