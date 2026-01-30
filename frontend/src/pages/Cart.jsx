import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity } from '../redux/cartSlice';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleQuantityChange = (id, quantity) => {
        if (quantity > 0) {
            dispatch(updateCartItemQuantity({ id, quantity }));
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <FiShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/products" className="btn-primary inline-block">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="card p-4 flex gap-4">
                            <img
                                src={item.image || '/placeholder.jpg'}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-600 text-sm">{item.shgName}</p>
                                <p className="text-primary-600 font-bold mt-2">₹{item.price}</p>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => handleRemove(item._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-20">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Link to="/checkout" className="btn-primary w-full block text-center">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
