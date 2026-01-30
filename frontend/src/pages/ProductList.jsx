import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import {
    fetchProductsRequest,
    fetchProductsSuccess,
    fetchProductsFail,
    setFilters,
} from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiSearch, FiShoppingCart, FiEye, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error, filters, totalPages, currentPage } = useSelector(
        (state) => state.products
    );

    const [localSearch, setLocalSearch] = useState(filters.search || '');

    useEffect(() => {
        fetchProducts();
    }, [filters, currentPage]);

    const fetchProducts = async () => {
        dispatch(fetchProductsRequest());
        try {
            const params = {
                ...filters,
                page: currentPage,
            };
            const data = await getProducts(params);
            dispatch(fetchProductsSuccess(data));
        } catch (err) {
            dispatch(fetchProductsFail(err.response?.data?.message || 'Failed to fetch products'));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: localSearch }));
    };

    const handleCategoryFilter = (category) => {
        dispatch(setFilters({ category }));
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault(); // Prevent navigation
        dispatch(
            addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0]?.url,
                stock: product.stock,
                shgName: product.shgId?.shgName,
                quantity: 1,
            })
        );
        toast.success('Added to cart!');
    };

    const categories = [
        'All',
        'Handicrafts',
        'Textiles',
        'Food Products',
        'Home Decor',
        'Jewelry',
        'Organic Products',
        'Beauty Products',
        'Stationery',
        'Other',
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Discover Unique Products
                    </h1>
                    <p className="text-gray-600 mt-2 md:mt-0">
                        Handcrafted with love by Women Self-Help Groups
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search for products, SHGs, or categories..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                            />
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary-600 text-white px-6 rounded-lg font-medium hover:bg-primary-700 transition"
                        >
                            Search
                        </button>
                    </form>

                    {/* Category Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <FiFilter className="text-gray-400 mr-2 flex-shrink-0" />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryFilter(cat === 'All' ? '' : cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${(cat === 'All' && !filters.category) || filters.category === cat
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="py-20">
                        <Loader />
                    </div>
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-600 text-lg font-medium">No products found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/products/${product._id}`}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.images[0]?.url || '/placeholder.jpg'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md text-gray-700 shadow-sm">
                                                {product.category}
                                            </span>
                                        </div>
                                        {/* Hover Actions */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-primary-700 shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <FiShoppingCart /> Add to Cart
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                                            by {product.shgId?.shgName}
                                        </p>

                                        <div className="mt-auto flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Price</p>
                                                <p className="text-xl font-bold text-gray-900">₹{product.price}</p>
                                            </div>
                                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                                <span className="text-yellow-500 mr-1">★</span>
                                                <span className="text-sm font-bold text-gray-700">{product.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-12 bg-white p-4 rounded-xl shadow-sm inline-block mx-auto">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => dispatch(setFilters({ page: index + 1 }))}
                                        className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === index + 1
                                                ? 'bg-primary-600 text-white shadow-md'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductList;
