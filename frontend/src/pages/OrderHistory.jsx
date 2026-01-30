import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../services/orderService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiEye } from 'react-icons/fi';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getCustomerOrders();
            setOrders(data.orders || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FiClock className="text-yellow-500" />;
            case 'accepted':
                return <FiCheckCircle className="text-blue-500" />;
            case 'processing':
                return <FiPackage className="text-blue-500" />;
            case 'shipped':
                return <FiTruck className="text-purple-500" />;
            case 'delivered':
                return <FiCheckCircle className="text-green-500" />;
            case 'cancelled':
            case 'rejected':
                return <FiXCircle className="text-red-500" />;
            default:
                return <FiPackage className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'badge-warning';
            case 'accepted':
            case 'processing':
                return 'badge-info';
            case 'shipped':
                return 'badge-secondary';
            case 'delivered':
                return 'badge-success';
            case 'cancelled':
            case 'rejected':
                return 'badge-danger';
            default:
                return 'badge-default';
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    if (loading) {
        return (
            <div className="py-20">
                <Loader />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <Link to="/products" className="btn-primary">
                        Continue Shopping
                    </Link>
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Filter Tabs */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {['all', 'pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="card p-12 text-center">
                        <FiPackage size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'all' ? "You haven't placed any orders yet" : `No ${filter} orders`}
                        </p>
                        <Link to="/products" className="btn-primary inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="card p-6 hover:shadow-lg transition">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-bold text-lg">Order #{order._id.slice(-8)}</h3>
                                            <span className={`badge ${getStatusColor(order.status)}`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                        <div className="text-right mr-4">
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="text-2xl font-bold text-primary-600">₹{order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="btn-outline flex items-center space-x-2"
                                        >
                                            <FiEye />
                                            <span>View Details</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="border-t pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {order.items.slice(0, 3).map((item, index) => (
                                            <div key={index} className="flex gap-3">
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/80'}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-bold text-primary-600">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {order.items.length > 3 && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            +{order.items.length - 3} more item(s)
                                        </p>
                                    )}
                                </div>

                                {/* Shipping Address */}
                                <div className="border-t mt-4 pt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                                    <p className="text-sm text-gray-600">
                                        {order.shippingAddress.name}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                    </p>
                                </div>

                                {/* Delivery Status */}
                                {order.deliveryStatus && (
                                    <div className="border-t mt-4 pt-4">
                                        <div className="flex items-center space-x-2 text-sm">
                                            {getStatusIcon(order.status)}
                                            <span className="font-medium">{order.deliveryStatus}</span>
                                            {order.estimatedDelivery && (
                                                <span className="text-gray-600">
                                                    • Expected by {new Date(order.estimatedDelivery).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
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

export default OrderHistory;
