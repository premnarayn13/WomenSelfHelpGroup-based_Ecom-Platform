import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance only if credentials are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

// Create Razorpay order
export const createRazorpayOrder = async (amount, currency = 'INR') => {
    if (!razorpay) {
        throw new Error('Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file');
    }
    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw new Error('Payment order creation failed: ' + error.message);
    }
};

// Verify Razorpay payment signature
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
    try {
        const text = `${orderId}|${paymentId}`;
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        return generatedSignature === signature;
    } catch (error) {
        throw new Error('Payment verification failed: ' + error.message);
    }
};

// Process refund
export const processRefund = async (paymentId, amount) => {
    try {
        const refund = await razorpay.payments.refund(paymentId, {
            amount: amount * 100, // Amount in paise
        });
        return refund;
    } catch (error) {
        throw new Error('Refund processing failed: ' + error.message);
    }
};
