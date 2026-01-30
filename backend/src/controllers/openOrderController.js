import OpenOrder from '../models/OpenOrder.js';
import SHG from '../models/SHG.js';
import Notification from '../models/Notification.js';

// @desc    Create new open order request
// @route   POST /api/open-orders
// @access  Private (Customer)
export const createOpenOrder = async (req, res) => {
    try {
        const { title, description, category, expectedPrice, quantity } = req.body;

        const openOrder = await OpenOrder.create({
            customerId: req.user._id,
            title,
            description,
            category,
            expectedPrice,
            quantity
        });

        res.status(201).json(openOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all open orders (for SHGs to browse)
// @route   GET /api/open-orders
// @access  Private (SHG)
export const getAllOpenOrders = async (req, res) => {
    try {
        const orders = await OpenOrder.find({ status: 'open' })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my open orders
// @route   GET /api/open-orders/my
// @access  Private (Customer)
export const getMyOpenOrders = async (req, res) => {
    try {
        const orders = await OpenOrder.find({ customerId: req.user._id })
            .populate({
                path: 'bids.shgId',
                select: 'shgName rating' // Populate SHG details in bids
            })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Place a bid/request to accept order
// @route   POST /api/open-orders/:id/bid
// @access  Private (SHG)
export const placeBid = async (req, res) => {
    try {
        const { message, price } = req.body;
        const orderId = req.params.id;

        const order = await OpenOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'open') {
            return res.status(400).json({ message: 'This order is no longer open' });
        }

        const shg = await SHG.findOne({ ownerUserId: req.user._id });
        if (!shg) {
            return res.status(404).json({ message: 'SHG profile not found' });
        }

        // Check if already bid
        const alreadyBid = order.bids.find(bid => bid.shgId.toString() === shg._id.toString());
        if (alreadyBid) {
            return res.status(400).json({ message: 'You have already placed a bid on this order' });
        }

        const bid = {
            shgId: shg._id,
            message,
            price
        };

        order.bids.push(bid);
        await order.save();

        // Notify Customer
        await Notification.create({
            userId: order.customerId,
            message: `New bid received from ${shg.shgName} for your request: ${order.title}`,
            type: 'info',
            link: `/open-orders`
        });

        res.json({ message: 'Bid placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept a bid
// @route   PUT /api/open-orders/:id/accept-bid
// @access  Private (Customer)
export const acceptBid = async (req, res) => {
    try {
        const { bidId } = req.body;
        const orderId = req.params.id;

        const order = await OpenOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const bid = order.bids.id(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        // Update Order Status
        order.status = 'assigned';

        // Update Bid Statuses
        order.bids.forEach(b => {
            if (b._id.toString() === bidId) {
                b.status = 'accepted';
            } else {
                b.status = 'rejected';
            }
        });

        await order.save();

        // Notify Winning SHG
        const winningSHG = await SHG.findById(bid.shgId);

        // CREATE A STANDARD ORDER FOR THE SHG TO TRACK
        await Order.create({
            orderId: `OPEN-${order._id.toString().slice(-6).toUpperCase()}`,
            customerId: order.customerId,
            shgId: bid.shgId,
            items: [{
                name: order.title,
                price: bid.price,
                quantity: 1, // Open orders are usually treatments of a whole requirement
                image: 'https://via.placeholder.com/150?text=Open+Order'
            }],
            shippingAddress: {
                name: req.user.name,
                phone: req.user.phone,
                street: 'Custom Request Address',
                city: 'N/A',
                state: 'N/A',
                pincode: '000000'
            },
            totalAmount: bid.price,
            paymentStatus: 'pending',
            orderStatus: 'accepted'
        });

        await Notification.create({
            userId: winningSHG.ownerUserId,
            message: `Congratulations! Your bid for "${order.title}" has been accepted! You can now see it in your Orders Dashboard.`,
            type: 'success',
            link: `/shg/orders`
        });

        res.json({ message: 'Bid accepted successfully and Order created', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import Order from '../models/Order.js';

