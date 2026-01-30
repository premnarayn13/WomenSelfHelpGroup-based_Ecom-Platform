import express from 'express';
import {
    getPendingSHGs,
    approveSHG,
    rejectSHG,
    getPendingProducts,
    approveProduct,
    getAllOrders,
    getAnalytics,
    manageUserStatus,
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/shgs/pending', protect, authorize('admin'), getPendingSHGs);
router.put('/shgs/:id/approve', protect, authorize('admin'), approveSHG);
router.put('/shgs/:id/reject', protect, authorize('admin'), rejectSHG);
router.get('/products/pending', protect, authorize('admin'), getPendingProducts);
router.put('/products/:id/approve', protect, authorize('admin'), approveProduct);
router.get('/orders', protect, authorize('admin'), getAllOrders);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.put('/users/:id/status', protect, authorize('admin'), manageUserStatus);

export default router;
