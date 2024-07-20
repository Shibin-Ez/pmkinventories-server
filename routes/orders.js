import express from 'express';
import { approveOrder, createOrder, getOrders, updateOrder } from '../controllers/orders.js';

const router = express.Router();

// CREATE - Initiate Order
router.post('/', createOrder);

// READ - Get All Orders
router.get('/', getOrders);

// UPDATE - Approve order
router.patch('/:id/approve', approveOrder);

// UPDATE - Update order from user side
router.patch('/:id/user-update', updateOrder);


export default router;