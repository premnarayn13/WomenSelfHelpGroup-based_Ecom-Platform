import api from './api';

export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

export const getCustomerOrders = async () => {
    const response = await api.get('/orders/customer/history');
    return response.data;
};

export const acceptOrder = async (id) => {
    const response = await api.put(`/orders/${id}/accept`);
    return response.data;
};

export const rejectOrder = async (id, reason) => {
    const response = await api.put(`/orders/${id}/reject`, { reason });
    return response.data;
};

export const updateOrderStatus = async (id, status, description) => {
    const response = await api.put(`/orders/${id}/status`, { status, description });
    return response.data;
};

export const cancelOrder = async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
};
