import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    shgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SHG',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const openOrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    expectedPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'assigned', 'completed', 'cancelled'],
        default: 'open'
    },
    bids: [bidSchema]
}, {
    timestamps: true
});

const OpenOrder = mongoose.model('OpenOrder', openOrderSchema);
export default OpenOrder;
