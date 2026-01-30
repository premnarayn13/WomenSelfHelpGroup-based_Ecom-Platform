import mongoose from 'mongoose';

const shgSchema = new mongoose.Schema(
    {
        shgName: {
            type: String,
            required: [true, 'Please provide SHG name'],
            trim: true,
        },
        ownerUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide SHG description'],
        },
        registrationNumber: {
            type: String,
            required: [true, 'Please provide registration number'],
            unique: true,
        },
        members: [
            {
                name: String,
                role: String,
                phone: String,
            },
        ],
        documents: [
            {
                documentType: {
                    type: String,
                    enum: ['registration', 'identity', 'address', 'bank', 'other'],
                },
                documentUrl: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        bankDetails: {
            accountHolderName: String,
            accountNumber: String,
            ifscCode: String,
            bankName: String,
            branch: String,
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: { type: String, default: 'India' },
        },
        approved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedAt: Date,
        rejectionReason: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const SHG = mongoose.model('SHG', shgSchema);

export default SHG;
