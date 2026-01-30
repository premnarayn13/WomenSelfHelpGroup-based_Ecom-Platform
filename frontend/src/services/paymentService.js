import api from './api';

export const initiatePayment = async (amount, currency = 'INR') => {
    const response = await api.post('/payments/initiate', { amount, currency });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
};

export const getPaymentHistory = async () => {
    const response = await api.get('/payments/history');
    return response.data;
};

// Load Razorpay script
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Display Razorpay payment modal
export const displayRazorpay = async (orderData, onSuccess, onFailure) => {
    const res = await loadRazorpayScript();

    if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        return;
    }

    const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SHG-Mart',
        description: 'Order Payment',
        order_id: orderData.orderId,
        handler: async function (response) {
            try {
                const verifyData = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                };
                const result = await verifyPayment(verifyData);
                onSuccess(result, orderData.paymentId);
            } catch (error) {
                onFailure(error);
            }
        },
        prefill: {
            name: '',
            email: '',
            contact: '',
        },
        theme: {
            color: '#0ea5e9',
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
};
