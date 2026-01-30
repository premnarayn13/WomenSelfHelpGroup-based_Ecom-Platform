import { useEffect, useState } from 'react';
import { getMyNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import Loader from '../components/common/Loader';
import { FiBell, FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="py-20"><Loader /></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FiBell /> Notifications
                    </h1>
                    {notifications.some(n => !n.isRead) && (
                        <button onClick={handleMarkAllAsRead} className="text-sm text-primary-600 hover:underline">
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No notifications yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-6 flex gap-4 transition-colors ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                                >
                                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {notification.type === 'success' ? <FiCheck /> :
                                            notification.type === 'warning' ? <FiAlertCircle /> : <FiInfo />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-gray-400">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                            {notification.link && (
                                                <Link to={notification.link} className="text-xs text-primary-600 font-bold hover:underline">
                                                    View Details &rarr;
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
