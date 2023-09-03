import express from 'express';
import { getUsers, getUser, createUser, updateUser } from '../controllers/users.js';

const router = express.Router();

// CREATE
router.post('/', createUser);

// READ
router.get('/', getUsers);
router.get('/:id', getUser);

// UPDATE
router.patch('/:id', updateUser);


export default router;