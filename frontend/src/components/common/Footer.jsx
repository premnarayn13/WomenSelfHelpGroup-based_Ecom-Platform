import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">SHG-Mart</h3>
                        <p className="text-sm">
                            Empowering Women Self-Help Groups through digital commerce. Buy authentic handmade products
                            directly from verified SHGs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/products" className="hover:text-white transition">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-white transition">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For SHGs */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">For SHGs</h3>
                        <ul className="space-y-2 text-sm">
                            {!userInfo && (
                                <li>
                                    <Link to="/register" className="hover:text-white transition">
                                        Register as SHG
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/shg/guidelines" className="hover:text-white transition">
                                    Seller Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link to="/shg/support" className="hover:text-white transition">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                                <FiMail />
                                <span>support@shgmart.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <FiPhone />
                                <span>+91 1234567890</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <FiMapPin />
                                <span>India</span>
                            </li>
                        </ul>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="hover:text-white transition">
                                <FiFacebook size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition">
                                <FiInstagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>&copy; {new Date().getFullYear()} SHG-Mart. All rights reserved. Built with ❤️ for Women SHGs.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
