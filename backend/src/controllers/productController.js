import Product from '../models/Product.js';
import SHG from '../models/SHG.js';
import multer from 'multer';
import { uploadMultipleImages, deleteImage } from '../services/imageService.js';

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

export const upload = multer({ storage: storage });

// @desc    Create new product
// @route   POST /api/products
// @access  Private (SHG role)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, subcategory } = req.body;

        // Get SHG
        const shg = await SHG.findOne({ ownerUserId: req.user._id });

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found. Please register as SHG first.' });
        }

        if (!shg.approved) {
            return res.status(403).json({ message: 'SHG not approved yet. Please wait for admin approval.' });
        }

        // Handle image uploads
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await uploadMultipleImages(req.files, 'shg-mart/products');
            images = uploadedImages;
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            images,
            category,
            subcategory,
            shgId: shg._id,
        });

        res.status(201).json({
            message: 'Product created successfully. Awaiting admin approval.',
            product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (SHG role)
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check ownership
        const shg = await SHG.findOne({ ownerUserId: req.user._id });
        if (product.shgId.toString() !== shg._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const { name, description, price, stock, category, subcategory, isActive } = req.body;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price !== undefined ? price : product.price;
        product.stock = stock !== undefined ? stock : product.stock;
        product.category = category || product.category;
        product.subcategory = subcategory || product.subcategory;
        product.isActive = isActive !== undefined ? isActive : product.isActive;

        // Handle new images
        if (req.files && req.files.length > 0) {
            const uploadedImages = await uploadMultipleImages(req.files, 'shg-mart/products');
            product.images = [...product.images, ...uploadedImages];
        }

        const updatedProduct = await product.save();

        res.json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (SHG role)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check ownership
        const shg = await SHG.findOne({ ownerUserId: req.user._id });
        if (product.shgId.toString() !== shg._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        // Delete images from Cloudinary
        for (const image of product.images) {
            if (image.publicId) {
                await deleteImage(image.publicId);
            }
        }

        await product.deleteOne();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

        const query = { isActive: true, isApproved: true };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query)
            .populate('shgId', 'shgName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('shgId', 'shgName description address');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add product review
// @route   POST /api/products/:id/review
// @access  Private (Customer)
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.userId.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            userId: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get products by SHG
// @route   GET /api/products/shg/:shgId
// @access  Public
export const getSHGProducts = async (req, res) => {
    try {
        const products = await Product.find({
            shgId: req.params.shgId,
            isActive: true,
            isApproved: true,
        }).populate('shgId', 'shgName');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
