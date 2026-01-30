import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, addReview as addReviewService } from '../services/productService';
import { addToCart } from '../redux/cartSlice';
import { fetchProductRequest, fetchProductSuccess, fetchProductFail } from '../redux/productSlice';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiShoppingCart, FiHeart, FiShare2, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.products);
    const { userInfo } = useSelector((state) => state.auth);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        dispatch(fetchProductRequest());
        try {
            const data = await getProductById(id);
            dispatch(fetchProductSuccess(data));
        } catch (err) {
            dispatch(fetchProductFail(err.response?.data?.message || 'Failed to fetch product'));
        }
    };

    const handleAddToCart = () => {
        if (quantity > product.stock) {
            toast.error('Quantity exceeds available stock');
            return;
        }

        dispatch(
            addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0]?.url,
                stock: product.stock,
                shgName: product.shgId?.shgName,
                quantity: quantity,
            })
        );
        toast.success('Added to cart!');
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error('Please login to add a review');
            navigate('/login');
            return;
        }

        try {
            await addReviewService(id, { rating, comment });
            toast.success('Review added successfully!');
            setShowReviewForm(false);
            setRating(5);
            setComment('');
            fetchProduct();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add review');
        }
    };

    if (loading) {
        return (
            <div className="py-20">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p>Product not found</p>
            </div>
        );
    }

    const images = product.images?.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/600x600?text=No+Image' }];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center space-x-2">
                        <li><a href="/" className="text-gray-600 hover:text-primary-600">Home</a></li>
                        <li className="text-gray-400">/</li>
                        <li><a href="/products" className="text-gray-600 hover:text-primary-600">Products</a></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900 font-medium">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="card overflow-hidden mb-4">
                            <img
                                src={images[selectedImage]?.url}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`card overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary-600' : ''
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-20 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="card p-6">
                            <span className="badge badge-info mb-3">{product.category}</span>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                            size={20}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600">
                                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                                </span>
                            </div>

                            {/* SHG Info */}
                            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-gray-600 mb-1">Sold by</p>
                                <p className="font-semibold text-lg text-gray-900">{product.shgId?.shgName}</p>
                                <p className="text-sm text-gray-600 mt-1">{product.shgId?.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-bold text-primary-600">₹{product.price}</span>
                                    <span className="text-gray-500 line-through">₹{(product.price * 1.3).toFixed(0)}</span>
                                    <span className="badge badge-success">23% OFF</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stock > 0 ? (
                                    <div className="flex items-center space-x-2 text-green-600">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span className="font-medium">In Stock ({product.stock} available)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 text-red-600">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {product.stock > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            className="w-20 text-center border border-gray-300 rounded-lg py-2"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-3 mb-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                                >
                                    <FiShoppingCart />
                                    <span>Add to Cart</span>
                                </button>
                                <button className="btn-outline flex items-center justify-center px-4">
                                    <FiHeart size={20} />
                                </button>
                                <button className="btn-outline flex items-center justify-center px-4">
                                    <FiShare2 size={20} />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                                <div className="text-center">
                                    <FiTruck className="mx-auto mb-2 text-primary-600" size={24} />
                                    <p className="text-xs text-gray-600">Free Delivery</p>
                                </div>
                                <div className="text-center">
                                    <FiShield className="mx-auto mb-2 text-primary-600" size={24} />
                                    <p className="text-xs text-gray-600">Secure Payment</p>
                                </div>
                                <div className="text-center">
                                    <FiRefreshCw className="mx-auto mb-2 text-primary-600" size={24} />
                                    <p className="text-xs text-gray-600">Easy Returns</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="card p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Reviews Section */}
                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        {userInfo && userInfo.role === 'customer' && (
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="btn-outline"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <FiStar
                                                size={32}
                                                className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    rows="4"
                                    className="input-field"
                                    placeholder="Share your experience with this product..."
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button type="submit" className="btn-primary">Submit Review</button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, index) => (
                                <div key={index} className="border-b pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold">{review.name}</p>
                                            <div className="flex items-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar
                                                        key={i}
                                                        size={16}
                                                        className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
