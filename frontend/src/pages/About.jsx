import { FiUsers, FiTrendingUp, FiAward, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-primary-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600" alt="Background" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Women, Transforming Lives</h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                        SHG-Mart is more than just a marketplace. It's a movement to bring the authentic skills of rural women entrepreneurs to the global stage.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Our Mission</span>
                            <h2 className="text-3xl font-bold text-gray-900">Bridging the Gap Between Talent and Opportunity</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We learned that millions of talented women in Self-Help Groups (SHGs) across the country create incredible handcrafted products but lack access to modern markets.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                SHG-Mart bridges this gap by providing a dedicated digital platform, logistics support, and marketing tools to help these micro-entrepreneurs scale their businesses and achieve financial independence.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div>
                                    <h3 className="text-3xl font-bold text-primary-600">10,000+</h3>
                                    <p className="text-gray-600">Artisans Empowered</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-primary-600">500+</h3>
                                    <p className="text-gray-600">Active SHGs</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=800"
                                alt="Women weaving"
                                className="rounded-2xl shadow-2xl z-10 relative"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-secondary-100 w-full h-full rounded-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
                        <p className="text-gray-600 mt-2">The principles that drive our revolution</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center card hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 text-2xl">
                                <FiUsers />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Community First</h3>
                            <p className="text-gray-600 text-sm">Every decision we make prioritizes the well-being of our artisan community.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center card hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary-600 text-2xl">
                                <FiAward />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Quality & Authenticity</h3>
                            <p className="text-gray-600 text-sm">We guarantee 100% authentic handmade products directly from the source.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center card hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
                                <FiTrendingUp />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Sustainable Growth</h3>
                            <p className="text-gray-600 text-sm">Promoting eco-friendly practices and sustainable economic models.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm text-center card hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-2xl">
                                <FiHeart />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Transparency</h3>
                            <p className="text-gray-600 text-sm">Fair pricing mechanisms ensuring maximum benefit to the creators.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
                    {/* Pattern */}
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,59.6,29.1C49,39.7,39.1,48.6,27.9,55.9C16.9,63.2,4.6,68.9,-6.9,67.5C-18.4,66.1,-29.1,57.6,-39.7,49.2C-50.3,40.8,-60.8,32.5,-67.2,21.8C-73.6,11.1,-75.9,-2,-72.7,-13.8C-69.5,-25.6,-60.8,-36.1,-50.3,-45.1C-39.8,-54.1,-27.5,-61.6,-14.8,-63.9C-2.2,-66.2,10.8,-63.3,30.5,-62.7L44.7,-76.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Join the Story</h2>
                    <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Whether you are a buyer looking for unique products or an SHG looking for a market, you are part of our journey.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Link to="/products" className="btn-primary py-3 px-8 text-lg">Shop Now</Link>
                        <Link to="/register" className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-gray-900 py-3 px-8 text-lg">Register as Seller</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
