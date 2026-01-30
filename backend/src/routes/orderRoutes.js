import express from 'express';
import {
    createOrder,
    getOrderById,
    getCustomerOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/customer/history', protect, authorize('customer'), getCustomerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/accept', protect, authorize('shg'), acceptOrder);
router.put('/:id/reject', protect, authorize('shg'), rejectOrder);
router.put('/:id/status', protect, authorize('shg'), updateOrderStatus);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

export default router;
