import SHG from '../models/SHG.js';
import Order from '../models/Order.js';
import multer from 'multer';
import { uploadMultipleImages } from '../services/imageService.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

export const upload = multer({ storage: storage });

// @desc    Register new SHG
// @route   POST /api/shg/register
// @access  Private (SHG role)
export const registerSHG = async (req, res) => {
    try {
        const { shgName, description, registrationNumber, members, bankDetails, address } = req.body;

        // Check if SHG already exists
        const shgExists = await SHG.findOne({ ownerUserId: req.user._id });
        if (shgExists) {
            return res.status(400).json({ message: 'SHG already registered for this user' });
        }

        // Check registration number uniqueness
        const regExists = await SHG.findOne({ registrationNumber });
        if (regExists) {
            return res.status(400).json({ message: 'Registration number already exists' });
        }

        // Handle document uploads
        let documents = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await uploadMultipleImages(req.files, 'shg-mart/documents');
            documents = uploadedImages.map((img, index) => ({
                documentType: req.body.documentTypes ? req.body.documentTypes[index] : 'other',
                documentUrl: img.url,
            }));
        }

        // Create SHG
        const shg = await SHG.create({
            shgName,
            ownerUserId: req.user._id,
            description,
            registrationNumber,
            members: members ? JSON.parse(members) : [],
            documents,
            bankDetails: bankDetails ? JSON.parse(bankDetails) : {},
            address: address ? JSON.parse(address) : {},
        });

        res.status(201).json({
            message: 'SHG registered successfully. Awaiting admin approval.',
            shg,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get SHG profile
// @route   GET /api/shg/profile
// @access  Private (SHG role)
export const getSHGProfile = async (req, res) => {
    try {
        const shg = await SHG.findOne({ ownerUserId: req.user._id }).populate('ownerUserId', 'name email phone');

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found' });
        }

        res.json(shg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update SHG profile
// @route   PUT /api/shg/profile
// @access  Private (SHG role)
export const updateSHG = async (req, res) => {
    try {
        const shg = await SHG.findOne({ ownerUserId: req.user._id });

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found' });
        }

        const { shgName, description, members, bankDetails, address } = req.body;

        shg.shgName = shgName || shg.shgName;
        shg.description = description || shg.description;
        shg.members = members || shg.members;
        shg.bankDetails = bankDetails || shg.bankDetails;
        shg.address = address || shg.address;

        const updatedSHG = await shg.save();

        res.json({
            message: 'SHG updated successfully',
            shg: updatedSHG,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get SHG orders
// @route   GET /api/shg/orders
// @access  Private (SHG role)
export const getSHGOrders = async (req, res) => {
    try {
        const shg = await SHG.findOne({ ownerUserId: req.user._id });

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found' });
        }

        const orders = await Order.find({ shgId: shg._id })
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get SHG earnings
// @route   GET /api/shg/earnings
// @access  Private (SHG role)
export const getSHGEarnings = async (req, res) => {
    try {
        const shg = await SHG.findOne({ ownerUserId: req.user._id });

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found' });
        }

        const orders = await Order.find({
            shgId: shg._id,
            paymentStatus: 'completed',
            orderStatus: { $in: ['accepted', 'processing', 'shipped', 'delivered'] },
        });

        const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const deliveredOrders = orders.filter((order) => order.orderStatus === 'delivered');
        const deliveredEarnings = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({
            totalOrders: orders.length,
            totalEarnings,
            deliveredOrders: deliveredOrders.length,
            deliveredEarnings,
            pendingEarnings: totalEarnings - deliveredEarnings,
            orders: orders.slice(0, 10), // Last 10 orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products belonging to the logged-in SHG
// @route   GET /api/shg/products
// @access  Private (SHG role)
export const getMyProducts = async (req, res) => {
    try {
        const shg = await SHG.findOne({ ownerUserId: req.user._id });

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found' });
        }

        const products = await Product.find({ shgId: shg._id }).populate('shgId', 'shgName');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all public SHGs
// @route   GET /api/shg/public/list
// @access  Public
export const getPublicSHGs = async (req, res) => {
    try {
        const shgs = await SHG.find({ approved: true, isActive: true })
            .select('shgName description address members');
        res.json(shgs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import Product from '../models/Product.js';


