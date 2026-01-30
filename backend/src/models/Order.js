import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        shgId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SHG',
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: String,
                price: Number,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                image: String,
            },
        ],
        shippingAddress: {
            name: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: { type: String, default: 'India' },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['placed', 'accepted', 'rejected', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'placed',
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
        },
        deliveryTracking: [
            {
                status: String,
                description: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        rejectionReason: String,
        deliveredAt: Date,
        cancelledAt: Date,
    },
    {
        timestamps: true,
    }
);

// Auto-generate orderId before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderId) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 7);
        this.orderId = `ORD-${timestamp}-${random}`.toUpperCase();
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
