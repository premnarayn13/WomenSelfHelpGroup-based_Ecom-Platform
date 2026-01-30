import express from 'express';
import {
    initiatePayment,
    verifyPayment,
    handleWebhook,
    getPaymentHistory,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/history', protect, getPaymentHistory);

export default router;
