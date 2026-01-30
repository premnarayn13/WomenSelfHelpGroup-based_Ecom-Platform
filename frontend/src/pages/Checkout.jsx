import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress, clearCart } from '../redux/cartSlice';
import { createOrder as createOrderService } from '../services/orderService';
import { initiatePayment, displayRazorpay } from '../services/paymentService';
import { createOrderSuccess } from '../redux/orderSlice';
import { toast } from 'react-toastify';
import { FiMapPin, FiCreditCard, FiPackage, FiCheckCircle, FiChevronRight, FiCheck } from 'react-icons/fi';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, shippingAddress: savedAddress } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const [step, setStep] = useState(1);
    const [shippingAddress, setShippingAddress] = useState(
        savedAddress || {
            name: userInfo?.name || '',
            phone: userInfo?.phone || '',
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
        }
    );

    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [processing, setProcessing] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress(shippingAddress));
        setStep(2);
    };

    const handlePaymentSubmit = () => {
        setStep(3);
    };

    const handlePlaceOrder = async () => {
        setProcessing(true);

        try {
            // Group items by SHG (backend logic handles shgId assignment per item)
            // Ideally we should split orders if multi-SHG, but for now we send all items.

            const orderItems = cartItems.map((item) => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            }));

            if (paymentMethod === 'razorpay') {
                // Initiate Razorpay payment
                const paymentData = await initiatePayment(total);

                // Display Razorpay modal
                await displayRazorpay(
                    paymentData,
                    async (verificationResult, paymentId) => {
                        await finalizeOrder(orderItems, paymentId);
                    },
                    (error) => {
                        toast.error('Payment failed. Please try again.');
                        setProcessing(false);
                    }
                );
            } else {
                // Cash on Delivery
                await finalizeOrder(orderItems);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
            setProcessing(false);
        }
    };

    const finalizeOrder = async (orderItems, paymentId = null) => {
        try {
            const orderData = {
                items: orderItems,
                shippingAddress,
                totalAmount: total,
                paymentId: paymentId,
                paymentStatus: paymentId ? 'completed' : 'pending', // COD is pending
            };

            const order = await createOrderService(orderData);
            dispatch(createOrderSuccess(order.order));
            dispatch(clearCart());
            toast.success('Order placed successfully!');
            navigate(`/orders/${order.order._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to finalize order');
            setProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <FiPackage size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center max-w-3xl mx-auto relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-5 w-full h-1 bg-gray-200 -z-10"></div>
                        <div className="absolute left-0 top-5 h-1 bg-primary-600 -z-10 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }}></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center bg-gray-50 px-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= 1 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                <FiMapPin />
                            </div>
                            <span className={`mt-2 text-sm font-medium ${step >= 1 ? 'text-primary-600' : 'text-gray-500'}`}>Address</span>
                        </div>

                        <div className="flex-grow"></div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center bg-gray-50 px-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= 2 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                <FiCreditCard />
                            </div>
                            <span className={`mt-2 text-sm font-medium ${step >= 2 ? 'text-primary-600' : 'text-gray-500'}`}>Payment</span>
                        </div>

                        <div className="flex-grow"></div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center bg-gray-50 px-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= 3 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                <FiCheckCircle />
                            </div>
                            <span className={`mt-2 text-sm font-medium ${step >= 3 ? 'text-primary-600' : 'text-gray-500'}`}>Confirm</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Step 1: Shipping Address */}
                        {step === 1 && (
                            <div className="card p-6">
                                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingAddress.name}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                pattern="[0-9]{10}"
                                                value={shippingAddress.phone}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingAddress.street}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                            className="input-field"
                                            placeholder="House No., Building Name, Street"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingAddress.state}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                            <input
                                                type="text"
                                                required
                                                pattern="[0-9]{6}"
                                                value={shippingAddress.pincode}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                        Continue <FiChevronRight />
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <div className="card p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600">
                                        &larr; Back
                                    </button>
                                    <h2 className="text-xl font-bold">Select Payment Method</h2>
                                </div>
                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'razorpay' ? 'border-primary-600 bg-primary-50' : 'hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="razorpay"
                                            checked={paymentMethod === 'razorpay'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3 text-primary-600 focus:ring-primary-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Online Payment</p>
                                            <p className="text-sm text-gray-500">Secure payment via Razorpay (UPI, Cards, Net Banking)</p>
                                        </div>
                                        <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-6 opacity-70" />
                                    </label>

                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3 text-primary-600 focus:ring-primary-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Cash on Delivery</p>
                                            <p className="text-sm text-gray-500">Pay simply when you receive your order</p>
                                        </div>
                                        <FiPackage className="text-2xl text-gray-400" />
                                    </label>
                                </div>
                                <button
                                    onClick={handlePaymentSubmit}
                                    className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                                >
                                    Review Order <FiChevronRight />
                                </button>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="card p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600">
                                            &larr; Back
                                        </button>
                                        <h2 className="text-xl font-bold">Review Your Order</h2>
                                    </div>

                                    {/* Address Review */}
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-700">Delivering to</h3>
                                            <button onClick={() => setStep(1)} className="text-primary-600 text-sm font-medium">Change</button>
                                        </div>
                                        <p className="font-medium">{shippingAddress.name}</p>
                                        <p className="text-sm text-gray-600">{shippingAddress.street}, {shippingAddress.city}</p>
                                        <p className="text-sm text-gray-600">{shippingAddress.state} - {shippingAddress.pincode}</p>
                                        <p className="text-sm text-gray-600">Ph: {shippingAddress.phone}</p>
                                    </div>

                                    {/* Payment Review */}
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-700">Payment Method</h3>
                                            <button onClick={() => setStep(2)} className="text-primary-600 text-sm font-medium">Change</button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {paymentMethod === 'razorpay' ? (
                                                <>
                                                    <span className="font-medium">Online Payment</span>
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Secure</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-medium">Cash on Delivery</span>
                                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Pay on delivery</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={processing}
                                        className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-4 text-lg shadow-lg shadow-primary-600/30"
                                    >
                                        {processing ? (
                                            'Processing...'
                                        ) : (
                                            <>
                                                Confirm & Pay <span className="font-bold">₹{total.toFixed(2)}</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-center text-gray-500 mt-4">
                                        By confirming, you agree to SHG-Mart's Terms of Service.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-gray-900 mt-1">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax (18% GST)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {subtotal < 500 && (
                                <div className="mt-4 bg-blue-50 text-blue-700 text-xs p-3 rounded-lg text-center">
                                    Add <b>₹{(500 - subtotal).toFixed(2)}</b> more for <span className="font-bold">FREE Shipping</span>!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
