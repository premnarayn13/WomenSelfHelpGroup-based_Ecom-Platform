import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/orderService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { toast } from 'react-toastify';
import { FiPackage, FiCheckCircle, FiTruck, FiMapPin, FiPhone, FiMail, FiXCircle } from 'react-icons/fi';

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const data = await getOrderById(id);
            setOrder(data.order);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        setCancelling(true);
        try {
            await cancelOrder(id);
            toast.success('Order cancelled successfully');
            fetchOrder();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    const getTrackingSteps = () => {
        const steps = [
            { status: 'pending', label: 'Order Placed', icon: FiPackage },
            { status: 'accepted', label: 'Order Accepted', icon: FiCheckCircle },
            { status: 'processing', label: 'Processing', icon: FiPackage },
            { status: 'shipped', label: 'Shipped', icon: FiTruck },
            { status: 'delivered', label: 'Delivered', icon: FiCheckCircle },
        ];

        const statusIndex = steps.findIndex((step) => step.status === order?.status);
        return steps.map((step, index) => ({
            ...step,
            completed: index <= statusIndex,
            active: index === statusIndex,
        }));
    };

    if (loading) {
        return (
            <div className="py-20">
                <Loader />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ErrorMessage message={error || 'Order not found'} />
                <button onClick={() => navigate('/orders')} className="btn-primary mt-4">
                    Back to Orders
                </button>
            </div>
        );
    }

    const trackingSteps = getTrackingSteps();
    const canCancel = ['pending', 'accepted'].includes(order.status);

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate('/orders')} className="text-primary-600 mb-6 flex items-center space-x-2">
                    <span>←</span>
                    <span>Back to Orders</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <div className="card p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">Order #{order._id.slice(-8)}</h1>
                                    <p className="text-gray-600">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                {canCancel && (
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={cancelling}
                                        className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                            </div>

                            {/* Tracking Timeline */}
                            {order.status !== 'cancelled' && order.status !== 'rejected' ? (
                                <div className="relative">
                                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                                    <div className="space-y-8">
                                        {trackingSteps.map((step, index) => {
                                            const Icon = step.icon;
                                            return (
                                                <div key={index} className="relative flex items-start">
                                                    <div
                                                        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${step.completed
                                                                ? 'bg-green-500 text-white'
                                                                : step.active
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'bg-gray-300 text-gray-600'
                                                            }`}
                                                    >
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <p className={`font-semibold ${step.completed || step.active ? 'text-gray-900' : 'text-gray-500'}`}>
                                                            {step.label}
                                                        </p>
                                                        {step.active && order.deliveryStatus && (
                                                            <p className="text-sm text-gray-600 mt-1">{order.deliveryStatus}</p>
                                                        )}
                                                        {step.active && order.estimatedDelivery && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Expected by {new Date(order.estimatedDelivery).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-4">
                                    <FiXCircle className="text-red-600" size={48} />
                                    <div>
                                        <p className="font-bold text-red-900 text-lg">Order {order.status === 'cancelled' ? 'Cancelled' : 'Rejected'}</p>
                                        <p className="text-red-700 text-sm mt-1">
                                            {order.status === 'cancelled'
                                                ? 'This order has been cancelled'
                                                : 'This order was rejected by the seller'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="card p-6">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/100'}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                                            <p className="text-primary-600 font-bold text-lg mt-2">₹{item.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="card p-6">
                            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium">{order.paymentId ? 'Online Payment' : 'Cash on Delivery'}</span>
                                </div>
                                {order.paymentId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment ID</span>
                                        <span className="font-mono text-sm">{order.paymentId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                        {order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <div className="card p-6 sticky top-20">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>₹{(order.totalAmount / 1.18).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (GST)</span>
                                    <span>₹{(order.totalAmount - order.totalAmount / 1.18).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="card p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                <FiMapPin />
                                <span>Shipping Address</span>
                            </h2>
                            <div className="text-sm space-y-1">
                                <p className="font-semibold">{order.shippingAddress.name}</p>
                                <p className="text-gray-600">{order.shippingAddress.street}</p>
                                <p className="text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state}
                                </p>
                                <p className="text-gray-600">{order.shippingAddress.pincode}</p>
                                <p className="text-gray-600 flex items-center space-x-2 mt-2">
                                    <FiPhone size={14} />
                                    <span>{order.shippingAddress.phone}</span>
                                </p>
                            </div>
                        </div>

                        {/* Seller Information */}
                        {order.shgId && (
                            <div className="card p-6">
                                <h2 className="text-xl font-bold mb-4">Seller Information</h2>
                                <div className="text-sm space-y-2">
                                    <p className="font-semibold text-lg">{order.shgId.shgName}</p>
                                    <p className="text-gray-600">{order.shgId.description}</p>
                                    {order.shgId.contactEmail && (
                                        <p className="text-gray-600 flex items-center space-x-2 mt-2">
                                            <FiMail size={14} />
                                            <span>{order.shgId.contactEmail}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
