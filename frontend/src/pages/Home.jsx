import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProducts } from '../services/productService';
import { FiShoppingBag, FiUsers, FiTrendingUp, FiArrowRight, FiCheckCircle, FiStar } from 'react-icons/fi';
import Loader from '../components/common/Loader';

const Home = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await getProducts({ limit: 4, sort: '-rating' });
                setFeaturedProducts(data.products);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const categories = [
        { name: 'Handicrafts', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', count: '120+ Products' },
        { name: 'Textiles', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', count: '85+ Products' },
        { name: 'Food Products', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', count: '200+ Products' },
        { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400', count: '50+ Products' },
        { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', count: '150+ Products' },
        { name: 'Beauty', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400', count: '60+ Products' },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white min-h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=1600" alt="Background" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="inline-block bg-primary-600/20 border border-primary-500/30 text-primary-300 rounded-full px-4 py-1 text-sm font-semibold backdrop-blur-sm">
                                #EmpoweringWomen
                            </span>
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                                Authentic Handmade <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                                    Treasures of India
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-lg">
                                Directly from Women Self-Help Groups to your doorstep. Every purchase creates a story of empowerment.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2">
                                    <FiShoppingBag /> Shop Now
                                </Link>
                                <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2">
                                    Learn More <FiArrowRight />
                                </Link>
                            </div>
                            <div className="pt-8 flex items-center gap-8 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-400" /> 100% Authentic
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-400" /> Verified Sellers
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-400" /> Secure Payment
                                </div>
                            </div>
                        </div>
                        {/* Hero Image Grid */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="space-y-4 translate-y-8">
                                <img src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400" className="rounded-2xl shadow-2xl w-full h-64 object-cover" alt="Product" />
                                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" className="rounded-2xl shadow-2xl w-full h-48 object-cover" alt="Product" />
                            </div>
                            <div className="space-y-4">
                                <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400" className="rounded-2xl shadow-2xl w-full h-48 object-cover" alt="Product" />
                                <img src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400" className="rounded-2xl shadow-2xl w-full h-64 object-cover" alt="Product" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Cards */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24 relative z-20">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 group hover:translate-y-[-5px] transition-all duration-300">
                            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FiUsers className="text-primary-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Community Driven</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Connect directly with artisans. Your purchase supports livelihood of rural women entrepreneurs.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 group hover:translate-y-[-5px] transition-all duration-300">
                            <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FiShoppingBag className="text-secondary-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Premium Quality</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every product is handpicked and quality verified. Experience the best of Indian craftsmanship.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 group hover:translate-y-[-5px] transition-all duration-300">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FiTrendingUp className="text-green-600 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Fair Trade</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Transparent pricing ensures artisans get paid what they deserve. No middlemen, zero commission.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
                        <p className="text-gray-600 mt-2">Explore our wide range of authentic products</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/products?category=${category.name}`}
                                className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                                    <p className="text-gray-300 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        {category.count}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Best Selling Products */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                            <p className="text-gray-600 mt-2">Most loved products by our community</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition">
                            View All Products <FiArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => (
                                <Link key={product._id} to={`/products/${product._id}`} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.images[0]?.url || '/placeholder.jpg'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-bold text-yellow-500 shadow-sm flex items-center gap-1">
                                            <FiStar className="fill-current" /> {product.rating.toFixed(1)}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">{product.shgId?.shgName}</p>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
                                            </div>
                                            <span className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-primary-600 hover:text-white transition-colors">
                                                <FiShoppingBag />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/products" className="btn-outline w-full justify-center">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            {!userInfo || userInfo.role === 'customer' ? (
                                <>
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                        Are you a Self-Help Group?
                                    </h2>
                                    <p className="text-xl text-primary-100 mb-10">
                                        Join thousands of SHGs scaling their business online. We provide end-to-end support for packaging, logistics, and marketing.
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <Link to="/register" className="bg-white text-primary-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition shadow-lg">
                                            Register as Seller
                                        </Link>
                                        <Link to="/about" className="bg-primary-800 border-2 border-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition">
                                            Learn More
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                        Welcome Back, {userInfo.name}!
                                    </h2>
                                    <p className="text-xl text-primary-100 mb-10">
                                        Ready to grow your business? Go to your dashboard to manage products and orders.
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <Link to={userInfo.role === 'admin' ? '/admin/dashboard' : '/shg/dashboard'} className="bg-white text-primary-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition shadow-lg">
                                            Go to Dashboard
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
