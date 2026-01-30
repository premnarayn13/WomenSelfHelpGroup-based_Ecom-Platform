import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSHGProfile, getSHGEarnings } from '../services/shgService';
import { FiPackage, FiDollarSign, FiTrendingUp, FiCreditCard, FiInbox, FiPlus, FiSettings } from 'react-icons/fi';
import Loader from '../components/common/Loader';

const SHGDashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileData, earningsData] = await Promise.all([
                getSHGProfile(),
                getSHGEarnings(),
            ]);
            setProfile(profileData);
            setEarnings(earningsData);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                // SHG Profile not found - user needs onboarding
                navigate('/shg/onboarding');
            } else {
                setError('Failed to load dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-20"><Loader /></div>;

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl inline-block">
                    <p className="font-bold text-xl">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 btn-primary">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 border-none">SHG Business Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {profile?.shgName}</p>
                </div>
                {!profile?.approved && (
                    <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        Awaiting Admin Approval
                    </span>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card p-6 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                            <FiPackage size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold">{earnings?.totalOrders || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                            <FiDollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold">₹{earnings?.totalEarnings || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-secondary-100 p-3 rounded-2xl text-secondary-600">
                            <FiTrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Success Rate</p>
                            <p className="text-2xl font-bold">
                                {earnings?.totalOrders > 0
                                    ? Math.round((earnings.deliveredOrders / earnings.totalOrders) * 100)
                                    : 100}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-6 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
                            <FiInbox size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Open Bids</p>
                            <p className="text-2xl font-bold">New Opportunities</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Areas */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Access Panels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/shg/inventory" className="card p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white hover:scale-[1.02] transition">
                            <FiInbox size={32} className="mb-4" />
                            <h3 className="text-xl font-bold mb-2">My Inventory</h3>
                            <p className="text-primary-100 text-sm">View, edit, and manage all your products in one place.</p>
                        </Link>
                        <Link to="/shg/products/add" className="card p-8 bg-white border-2 border-dashed border-primary-200 hover:border-primary-500 transition">
                            <FiPlus size={32} className="text-primary-600 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Add Product</h3>
                            <p className="text-gray-500 text-sm">Launch new products to the marketplace.</p>
                        </Link>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="card bg-white p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Recent Orders</h2>
                            <Link to="/shg/orders" className="text-primary-600 font-bold text-sm">View All &rarr;</Link>
                        </div>
                        {earnings?.orders?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-gray-500 border-b">
                                        <tr>
                                            <th className="pb-3">Order ID</th>
                                            <th className="pb-3">Customer</th>
                                            <th className="pb-3">Amount</th>
                                            <th className="pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {earnings.orders.map(order => (
                                            <tr key={order._id}>
                                                <td className="py-3 font-medium">{order.orderId}</td>
                                                <td className="py-3">{order.customerId?.name}</td>
                                                <td className="py-3 font-bold">₹{order.totalAmount}</td>
                                                <td className="py-3 capitalize">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500">No recent orders yet.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    {/* Account Settings / Bank Details */}
                    <div className="card bg-white p-6 border-l-4 border-primary-600">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <FiCreditCard className="text-primary-600" /> Account Details
                            </h2>
                            <button className="text-gray-400 hover:text-primary-600">
                                <FiSettings />
                            </button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-xs mb-1">Bank Name</p>
                                <p className="font-bold">{profile?.bankDetails?.bankName || 'Not Set'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-xs mb-1">Account Number</p>
                                <p className="font-bold">{profile?.bankDetails?.accountNumber || 'Not Set'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-xs mb-1">IFSC Code</p>
                                <p className="font-bold">{profile?.bankDetails?.ifscCode || 'Not Set'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-xs mb-1">Reg. Number</p>
                                <p className="font-bold">{profile?.registrationNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="card bg-gray-900 text-white p-6">
                        <h2 className="text-lg font-bold mb-4">Market Opportunities</h2>
                        <p className="text-gray-400 text-sm mb-6">Browse custom requirements from customers in the Open Market.</p>
                        <Link to="/open-orders" className="btn-primary w-full bg-white text-gray-900 border-none hover:bg-gray-200">
                            Open Market &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SHGDashboard;
