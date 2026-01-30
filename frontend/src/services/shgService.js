import api from './api';

export const registerSHG = async (formData) => {
    const response = await api.post('/shg/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getSHGProfile = async () => {
    const response = await api.get('/shg/profile');
    return response.data;
};

export const updateSHG = async (shgData) => {
    const response = await api.put('/shg/profile', shgData);
    return response.data;
};

export const getSHGOrders = async () => {
    const response = await api.get('/shg/orders');
    return response.data;
};

export const getSHGEarnings = async () => {
    const response = await api.get('/shg/earnings');
    return response.data;
};

export const getMyProducts = async () => {
    const response = await api.get('/shg/products');
    return response.data;
};
