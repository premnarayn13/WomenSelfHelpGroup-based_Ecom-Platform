import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';

// @desc    Initiate payment
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Create Razorpay order
        const razorpayOrder = await createRazorpayOrder(amount, currency);

        // Create payment record
        const payment = await Payment.create({
            orderId: req.body.orderId, // Temporary, will be updated after order creation
            gatewayOrderId: razorpayOrder.id,
            amount,
            currency: currency || 'INR',
            status: 'initiated',
        });

        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            paymentId: payment._id,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify signature
        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Update payment record
        const payment = await Payment.findOne({ gatewayOrderId: razorpay_order_id });

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        payment.gatewayPaymentId = razorpay_payment_id;
        payment.gatewaySignature = razorpay_signature;
        payment.status = 'success';
        payment.gatewayResponse = req.body;

        await payment.save();

        res.json({
            message: 'Payment verified successfully',
            paymentId: payment._id,
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Handle payment webhook
// @route   POST /api/payments/webhook
// @access  Public (but verified)
export const handleWebhook = async (req, res) => {
    try {
        const webhookBody = req.body;

        // Verify webhook signature (implement based on Razorpay docs)
        // This is a simplified version

        if (webhookBody.event === 'payment.captured') {
            const paymentId = webhookBody.payload.payment.entity.id;
            const orderId = webhookBody.payload.payment.entity.order_id;

            const payment = await Payment.findOne({ gatewayOrderId: orderId });

            if (payment) {
                payment.status = 'success';
                payment.gatewayPaymentId = paymentId;
                payment.gatewayResponse = webhookBody;
                await payment.save();
            }
        }

        res.json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id }).populate('paymentId');

        const payments = orders.map((order) => ({
            orderId: order.orderId,
            amount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
            payment: order.paymentId,
        }));

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
