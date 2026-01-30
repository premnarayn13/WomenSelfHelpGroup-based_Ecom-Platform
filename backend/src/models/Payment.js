import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        gatewayOrderId: {
            type: String,
            required: true,
        },
        gatewayPaymentId: String,
        gatewaySignature: String,
        method: {
            type: String,
            enum: ['card', 'upi', 'netbanking', 'wallet', 'other'],
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        status: {
            type: String,
            enum: ['initiated', 'success', 'failed'],
            default: 'initiated',
        },
        gatewayResponse: mongoose.Schema.Types.Mixed,
        failureReason: String,
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
