import { useEffect, useState } from 'react';
import { getAllOpenOrders, placeBid } from '../services/openOrderService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FiDollarSign, FiSend } from 'react-icons/fi';

const OpenOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidForm, setBidForm] = useState({ orderId: null, price: '', message: '' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOpenOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await placeBid(bidForm.orderId, {
                price: bidForm.price,
                message: bidForm.message
            });
            toast.success('Bid placed successfully!');
            setBidForm({ orderId: null, price: '', message: '' });
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place bid');
        }
    };

    if (loading) return <div className="py-20"><Loader /></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-6">Open Market Requirements</h1>
                <p className="mb-8 text-gray-600">Browse requirements posted by customers and place your bid to supply.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="card flex flex-col h-full hover:shadow-lg transition">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide">
                                        {order.category}
                                    </span>
                                    <span className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold mt-3 mb-2">{order.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{order.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                                    <div>
                                        <p className="text-gray-500">Quantity</p>
                                        <p className="font-bold">{order.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Budget</p>
                                        <p className="font-bold text-green-600">₹{order.expectedPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 border-t">
                                {bidForm.orderId === order._id ? (
                                    <form onSubmit={handleBidSubmit} className="space-y-3">
                                        <input
                                            type="number"
                                            required
                                            placeholder="Your Offer Price (₹)"
                                            className="input-field py-2 text-sm"
                                            value={bidForm.price}
                                            onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                                        />
                                        <textarea
                                            required
                                            placeholder="Message to customer (Why choose you?)"
                                            className="input-field py-2 text-sm"
                                            rows="2"
                                            value={bidForm.message}
                                            onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="btn-primary flex-1 py-2 text-sm">Send Bid</button>
                                            <button
                                                type="button"
                                                onClick={() => setBidForm({ orderId: null, price: '', message: '' })}
                                                className="btn-outline flex-1 py-2 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setBidForm({ orderId: order._id, price: '', message: '' })}
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        <FiSend /> Place Bid
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No open requirements available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpenOrderList;
