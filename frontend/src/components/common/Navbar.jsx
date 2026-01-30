import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiBell, FiBriefcase, FiPlusSquare } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (userInfo?.role === 'admin') return '/admin/dashboard';
        if (userInfo?.role === 'shg') return '/shg/dashboard';
        return '/profile';
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            SHG-Mart
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition">
                            Products
                        </Link>
                        <Link to="/communities" className="text-gray-700 hover:text-primary-600 font-medium transition">
                            Communities
                        </Link>

                        {/* Open Market Links */}
                        {userInfo?.role === 'customer' && (
                            <Link to="/open-orders/my" className="text-gray-700 hover:text-primary-600 font-medium transition flex items-center gap-1">
                                <FiPlusSquare /> My Requests
                            </Link>
                        )}
                        {userInfo?.role === 'shg' && (
                            <Link to="/open-orders" className="text-gray-700 hover:text-primary-600 font-medium transition flex items-center gap-1">
                                <FiBriefcase /> Open Market
                            </Link>
                        )}

                        <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium transition">
                            About
                        </Link>

                        {userInfo ? (
                            <>
                                <Link to="/notifications" className="text-gray-700 hover:text-primary-600 transition">
                                    <FiBell size={24} />
                                </Link>

                                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition">
                                    <FiShoppingCart size={24} />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    to={getDashboardLink()}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                                >
                                    <FiUser size={20} />
                                    <span>{(userInfo?.name || 'User').split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
                                >
                                    <FiLogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-outline px-4 py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary px-4 py-2">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link
                            to="/products"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Products
                        </Link>
                        {userInfo?.role === 'customer' && (
                            <Link
                                to="/open-orders/my"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Requests
                            </Link>
                        )}
                        {userInfo?.role === 'shg' && (
                            <Link
                                to="/open-orders"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Open Market
                            </Link>
                        )}
                        <Link
                            to="/about"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        {userInfo ? (
                            <>
                                <Link
                                    to="/notifications"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Notifications
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Cart ({cartItems.length})
                                </Link>
                                <Link
                                    to={getDashboardLink()}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
