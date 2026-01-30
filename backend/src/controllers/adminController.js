import SHG from '../models/SHG.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get pending SHGs
// @route   GET /api/admin/shgs/pending
// @access  Private (Admin)
export const getPendingSHGs = async (req, res) => {
    try {
        const shgs = await SHG.find({ approved: false, rejectionReason: { $exists: false } })
            .populate('ownerUserId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(shgs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve SHG
// @route   PUT /api/admin/shgs/:id/approve
// @access  Private (Admin)
export const approveSHG = async (req, res) => {
    try {
        const shg = await SHG.findById(req.params.id);

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found' });
        }

        shg.approved = true;
        shg.approvedBy = req.user._id;
        shg.approvedAt = Date.now();

        await shg.save();

        res.json({
            message: 'SHG approved successfully',
            shg,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject SHG
// @route   PUT /api/admin/shgs/:id/reject
// @access  Private (Admin)
export const rejectSHG = async (req, res) => {
    try {
        const { reason } = req.body;

        const shg = await SHG.findById(req.params.id);

        if (!shg) {
            return res.status(404).json({ message: 'SHG not found' });
        }

        shg.approved = false;
        shg.rejectionReason = reason;

        await shg.save();

        res.json({
            message: 'SHG rejected',
            shg,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending products
// @route   GET /api/admin/products/pending
// @access  Private (Admin)
export const getPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ isApproved: false })
            .populate('shgId', 'shgName')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve product
// @route   PUT /api/admin/products/:id/approve
// @access  Private (Admin)
export const approveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isApproved = true;

        await product.save();

        res.json({
            message: 'Product approved successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('customerId', 'name email')
            .populate('shgId', 'shgName')
            .sort({ createdAt: -1 })
            .limit(100);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalSHGs = await SHG.countDocuments({ approved: true });
        const pendingSHGs = await SHG.countDocuments({ approved: false, rejectionReason: { $exists: false } });
        const totalProducts = await Product.countDocuments({ isApproved: true });
        const pendingProducts = await Product.countDocuments({ isApproved: false });
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });

        const orders = await Order.find({ paymentStatus: 'completed' });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Recent orders
        const recentOrders = await Order.find({})
            .populate('customerId', 'name')
            .populate('shgId', 'shgName')
            .sort({ createdAt: -1 })
            .limit(10);

        // Top SHGs by revenue
        const topSHGs = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: '$shgId',
                    totalRevenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
        ]);

        // Populate SHG details
        for (let shg of topSHGs) {
            const shgDetails = await SHG.findById(shg._id);
            shg.shgName = shgDetails?.shgName;
        }

        res.json({
            users: {
                total: totalUsers,
                customers: totalCustomers,
            },
            shgs: {
                total: totalSHGs,
                pending: pendingSHGs,
            },
            products: {
                total: totalProducts,
                pending: pendingProducts,
            },
            orders: {
                total: totalOrders,
                completed: completedOrders,
            },
            revenue: {
                total: totalRevenue,
            },
            recentOrders,
            topSHGs,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manage user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const manageUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = isActive;

        await user.save();

        res.json({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
