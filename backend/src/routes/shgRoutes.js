import express from 'express';
import {
    registerSHG,
    getSHGProfile,
    updateSHG,
    getSHGOrders,
    getSHGEarnings,
    getMyProducts,
    getPublicSHGs,
    upload,
} from '../controllers/shgController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/public/list', getPublicSHGs);
router.post('/register', protect, authorize('shg'), upload.array('documents', 5), registerSHG);
router.get('/profile', protect, authorize('shg'), getSHGProfile);
router.put('/profile', protect, authorize('shg'), updateSHG);
router.get('/orders', protect, authorize('shg'), getSHGOrders);
router.get('/earnings', protect, authorize('shg'), getSHGEarnings);
router.get('/products', protect, authorize('shg'), getMyProducts);

export default router;
