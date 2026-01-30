import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/adminService';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign } from 'react-icons/fi';
import Loader from '../components/common/Loader';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await getAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20">
                <Loader />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Users</p>
                            <p className="text-3xl font-bold mt-2">{analytics?.users?.total || 0}</p>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <FiUsers className="text-primary-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total SHGs</p>
                            <p className="text-3xl font-bold mt-2">{analytics?.shgs?.total || 0}</p>
                            <p className="text-xs text-yellow-600 mt-1">
                                {analytics?.shgs?.pending || 0} pending
                            </p>
                        </div>
                        <div className="bg-secondary-100 p-3 rounded-full">
                            <FiShoppingBag className="text-secondary-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Products</p>
                            <p className="text-3xl font-bold mt-2">{analytics?.products?.total || 0}</p>
                            <p className="text-xs text-yellow-600 mt-1">
                                {analytics?.products?.pending || 0} pending
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FiPackage className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold mt-2">₹{analytics?.revenue?.total || 0}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <FiDollarSign className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
                    <div className="space-y-2">
                        <button className="btn-outline w-full text-left">
                            Approve SHGs ({analytics?.shgs?.pending || 0})
                        </button>
                        <button className="btn-outline w-full text-left">
                            Approve Products ({analytics?.products?.pending || 0})
                        </button>
                    </div>
                </div>

                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Management</h2>
                    <div className="space-y-2">
                        <button className="btn-outline w-full text-left">View All Orders</button>
                        <button className="btn-outline w-full text-left">Manage Users</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
