import api from './api';

export const createOpenOrder = async (orderData) => {
    const response = await api.post('/open-orders', orderData);
    return response.data;
};

export const getAllOpenOrders = async () => {
    const response = await api.get('/open-orders');
    return response.data;
};

export const getMyOpenOrders = async () => {
    const response = await api.get('/open-orders/my');
    return response.data;
};

export const placeBid = async (id, bidData) => {
    const response = await api.post(`/open-orders/${id}/bid`, bidData);
    return response.data;
};

export const acceptBid = async (id, bidId) => {
    const response = await api.put(`/open-orders/${id}/accept-bid`, { bidId });
    return response.data;
};
