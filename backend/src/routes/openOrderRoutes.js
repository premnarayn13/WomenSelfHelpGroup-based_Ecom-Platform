import express from 'express';
import {
    createOpenOrder,
    getAllOpenOrders,
    getMyOpenOrders,
    placeBid,
    acceptBid
} from '../controllers/openOrderController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createOpenOrder);
router.get('/', protect, authorize('shg'), getAllOpenOrders);
router.get('/my', protect, authorize('customer'), getMyOpenOrders);
router.post('/:id/bid', protect, authorize('shg'), placeBid);
router.put('/:id/accept-bid', protect, authorize('customer'), acceptBid);

export default router;
