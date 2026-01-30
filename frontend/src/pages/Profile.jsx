import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../services/authService';
import { logout, setCredentials } from '../redux/authSlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form States
    const [editForm, setEditForm] = useState({});
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setUser(data);
            setEditForm(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateProfile(editForm);
            dispatch(setCredentials(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await deleteAccount();
                dispatch(logout());
                navigate('/');
                toast.success('Account deleted successfully');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete account');
            }
        }
    };

    if (loading) return <div className="py-20"><Loader /></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-primary-900 h-32 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 bg-white rounded-full p-2 text-primary-900 border-4 border-white flex items-center justify-center text-5xl">
                                <FiUser />
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 capitalize">{user.role}</p>
                            </div>
                            <div className="flex gap-2">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn-outline flex items-center gap-2"
                                    >
                                        <FiEdit2 /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email (Cannot change)</label>
                                        <input
                                            type="text"
                                            value={editForm.email}
                                            disabled
                                            className="input-field bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                        className="input-field"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="btn-primary flex items-center gap-2">
                                        <FiSave /> Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditForm(user);
                                        }}
                                        className="btn-outline text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <FiX /> Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold border-b pb-2">Contact Information</h3>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <FiMail className="text-primary-600" /> {user.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <FiPhone className="text-primary-600" /> {user.phone || 'Not provided'}
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-700">
                                        <FiMapPin className="text-primary-600 mt-1" />
                                        <span>{user.address || 'No address added'}</span>
                                    </div>

                                    {user.role === 'shg' && (
                                        <div className="pt-4 mt-6 border-t border-gray-100">
                                            <button
                                                onClick={() => navigate('/shg/dashboard')}
                                                className="w-full btn-primary flex items-center justify-center gap-2"
                                            >
                                                Go to Business Dashboard
                                            </button>
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                Manage your products, orders, and business details.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 md:mt-0 pt-8 md:pt-0 border-t md:border-t-0 space-y-8">
                                    <div className="bg-primary-50 p-6 rounded-2xl">
                                        <h3 className="text-lg font-bold text-primary-900 mb-4">Account Security</h3>
                                        <button
                                            onClick={() => navigate('/change-password')}
                                            className="text-primary-700 font-medium hover:underline"
                                        >
                                            Change Password
                                        </button>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                                        >
                                            <FiTrash2 /> Delete Account
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Warning: This action will permanently deactivate your account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

