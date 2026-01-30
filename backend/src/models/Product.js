import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            min: 0,
        },
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            min: 0,
            default: 0,
        },
        images: [
            {
                url: String,
                publicId: String,
            },
        ],
        category: {
            type: String,
            required: [true, 'Please provide product category'],
            enum: [
                'Handicrafts',
                'Textiles',
                'Food Products',
                'Home Decor',
                'Jewelry',
                'Organic Products',
                'Beauty Products',
                'Stationery',
                'Other',
            ],
        },
        subcategory: String,
        shgId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SHG',
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [reviewSchema],
        isActive: {
            type: Boolean,
            default: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
