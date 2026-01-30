import { useEffect, useState } from 'react';
import { getMyOpenOrders, acceptBid } from '../services/openOrderService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FiClock, FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CustomerOpenOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getMyOpenOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBid = async (orderId, bidId) => {
        if (!window.confirm('Are you sure you want to accept this bid? This will close the order.')) return;

        try {
            await acceptBid(orderId, bidId);
            toast.success('Bid accepted!');
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to accept bid');
        }
    };

    if (loading) return <div className="py-20"><Loader /></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">My Posted Requirements</h1>
                    <Link to="/open-orders/create" className="btn-primary bg-secondary-600 hover:bg-secondary-700">
                        + New Requirement
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 mb-4">You haven't posted any requirements yet.</p>
                        <Link to="/open-orders/create" className="text-secondary-600 font-bold hover:underline">
                            Post your first requirement
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="card p-6 border-l-4 border-secondary-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold">{order.title}</h2>
                                        <p className="text-gray-600 mt-1">{order.description}</p>
                                        <div className="flex gap-4 mt-3 text-sm text-gray-500">
                                            <span>Quantity: <b>{order.quantity}</b></span>
                                            <span>Budget: <b>₹{order.expectedPrice}</b></span>
                                            <span>Posted: {new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`badge ${order.status === 'open' ? 'badge-primary' :
                                                order.status === 'assigned' ? 'badge-success' : 'badge-warning'
                                            }`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-2">{order.bids.length} Bids</p>
                                    </div>
                                </div>

                                {/* Bids Section */}
                                {order.bids.length > 0 && (
                                    <div className="mt-6 border-t pt-4">
                                        <button
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            className="text-sm font-bold text-secondary-600 flex items-center gap-2"
                                        >
                                            <FiMessageSquare />
                                            {expandedOrder === order._id ? 'Hide Bids' : `View ${order.bids.length} Bids`}
                                        </button>

                                        {expandedOrder === order._id && (
                                            <div className="mt-4 space-y-4">
                                                {order.bids.map((bid) => (
                                                    <div key={bid._id} className={`p-4 rounded-lg border ${bid.status === 'accepted' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="font-bold">{bid.shgId?.shgName || 'Unknown SHG'}</p>
                                                                <p className="text-gray-600 text-sm mt-1">{bid.message}</p>
                                                                <p className="font-bold text-green-700 mt-2">Quote: ₹{bid.price}</p>
                                                            </div>
                                                            <div>
                                                                {bid.status === 'pending' && order.status === 'open' && (
                                                                    <button
                                                                        onClick={() => handleAcceptBid(order._id, bid._id)}
                                                                        className="btn-primary text-xs px-3 py-1"
                                                                    >
                                                                        Accept Bid
                                                                    </button>
                                                                )}
                                                                {bid.status === 'accepted' && (
                                                                    <span className="flex items-center gap-1 text-green-700 font-bold text-sm">
                                                                        <FiCheckCircle /> Accepted
                                                                    </span>
                                                                )}
                                                                {bid.status === 'rejected' && (
                                                                    <span className="flex items-center gap-1 text-red-500 text-sm">
                                                                        <FiXCircle /> Rejected
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOpenOrders;
