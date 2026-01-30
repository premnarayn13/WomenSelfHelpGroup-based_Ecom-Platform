import Order from '../models/Order.js';
import Product from '../models/Product.js';
import SHG from '../models/SHG.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, paymentId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Get SHG ID from first product (assuming all items from same SHG)
        const product = await Product.findById(items[0].productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create order
        const order = await Order.create({
            customerId: req.user._id,
            shgId: product.shgId,
            items,
            shippingAddress,
            totalAmount,
            paymentId,
            paymentStatus: 'completed',
            deliveryTracking: [
                {
                    status: 'placed',
                    description: 'Order placed successfully',
                },
            ],
        });

        // Update product stock
        for (const item of items) {
            const prod = await Product.findById(item.productId);
            if (prod) {
                prod.stock -= item.quantity;
                await prod.save();
            }
        }

        res.status(201).json({
            message: 'Order created successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('shgId', 'shgName phone address')
            .populate('items.productId', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check authorization
        if (
            order.customerId._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            const shg = await SHG.findOne({ ownerUserId: req.user._id });
            if (!shg || order.shgId._id.toString() !== shg._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this order' });
            }
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get customer orders
// @route   GET /api/orders/customer/history
// @access  Private (Customer)
export const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id })
            .populate('shgId', 'shgName')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept order
// @route   PUT /api/orders/:id/accept
// @access  Private (SHG)
export const acceptOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership
        const shg = await SHG.findOne({ ownerUserId: req.user._id });
        if (order.shgId.toString() !== shg._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to accept this order' });
        }

        if (order.orderStatus !== 'placed') {
            return res.status(400).json({ message: 'Order cannot be accepted in current status' });
        }

        order.orderStatus = 'accepted';
        order.deliveryTracking.push({
            status: 'accepted',
            description: 'Order accepted by SHG',
        });

        await order.save();

        res.json({
            message: 'Order accepted successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject order
// @route   PUT /api/orders/:id/reject
// @access  Private (SHG)
export const rejectOrder = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership
        const shg = await SHG.findOne({ ownerUserId: req.user._id });
        if (order.shgId.toString() !== shg._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to reject this order' });
        }

        if (order.orderStatus !== 'placed') {
            return res.status(400).json({ message: 'Order cannot be rejected in current status' });
        }

        order.orderStatus = 'rejected';
        order.rejectionReason = reason;
        order.deliveryTracking.push({
            status: 'rejected',
            description: reason || 'Order rejected by SHG',
        });

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await order.save();

        res.json({
            message: 'Order rejected',
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (SHG)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, description } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership
        const shg = await SHG.findOne({ ownerUserId: req.user._id });
        if (order.shgId.toString() !== shg._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.orderStatus = status;
        order.deliveryTracking.push({
            status,
            description: description || `Order status updated to ${status}`,
        });

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.json({
            message: 'Order status updated successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership
        if (order.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (!['placed', 'accepted'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Order cannot be cancelled in current status' });
        }

        order.orderStatus = 'cancelled';
        order.cancelledAt = Date.now();
        order.deliveryTracking.push({
            status: 'cancelled',
            description: 'Order cancelled by customer',
        });

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await order.save();

        res.json({
            message: 'Order cancelled successfully',
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
