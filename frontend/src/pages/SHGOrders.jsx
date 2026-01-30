import { useEffect, useState } from 'react';
import { getSHGOrders } from '../services/shgService';
import { updateOrderStatus, acceptOrder, rejectOrder } from '../services/orderService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { toast } from 'react-toastify';
import { FiPackage, FiCheck, FiX, FiTruck, FiBox, FiMapPin, FiPhone } from 'react-icons/fi';

const SHGOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getSHGOrders();
            setOrders(Array.isArray(data) ? data : data.orders || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            if (newStatus === 'accepted') {
                await acceptOrder(orderId);
            } else if (newStatus === 'rejected') {
                await rejectOrder(orderId, 'Rejected by seller');
            } else {
                await updateOrderStatus(orderId, newStatus);
            }
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders(); // Refresh list
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        return order.orderStatus === filter;
    });

    if (loading) return <div className="py-20"><Loader /></div>;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['all', 'placed', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${filter === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {status === 'placed' ? 'New' : status}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 text-lg">No orders found in this category.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg">Order #{order.orderId || order._id.slice(-8)}</h3>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${order.orderStatus === 'placed' || order.orderStatus === 'pending' ? 'badge-warning' :
                                            order.orderStatus === 'delivered' ? 'badge-success' :
                                                order.orderStatus === 'cancelled' ? 'badge-danger' : 'badge-info'
                                            }`}>
                                            {(order.orderStatus || 'placed').toUpperCase()}
                                        </span>
                                        <span className="font-bold text-lg text-primary-600">₹{order.totalAmount}</span>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Items */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <FiBox /> Ordered Items
                                        </h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex gap-3">
                                                    <img
                                                        src={item.image || 'https://via.placeholder.com/150'}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <FiMapPin /> Delivery Details
                                        </h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p className="font-medium text-gray-900">{order.shippingAddress?.name}</p>
                                            <p>{order.shippingAddress?.street}</p>
                                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                                            <p className="flex items-center gap-2 mt-2">
                                                <FiPhone size={14} /> {order.shippingAddress?.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                                    {(order.orderStatus === 'placed' || order.orderStatus === 'pending') && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(order._id, 'accepted')}
                                                className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                            >
                                                <FiCheck /> Accept Order
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(order._id, 'rejected')}
                                                className="btn-outline border-red-500 text-red-500 hover:bg-red-50"
                                            >
                                                <FiX /> Reject
                                            </button>
                                        </>
                                    )}
                                    {order.orderStatus === 'accepted' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'processing')}
                                            className="btn-primary"
                                        >
                                            Process Order
                                        </button>
                                    )}
                                    {order.orderStatus === 'processing' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <FiTruck /> Mark as Shipped
                                        </button>
                                    )}
                                    {order.orderStatus === 'shipped' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                            className="btn-primary bg-green-600 hover:bg-green-700"
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SHGOrders;
