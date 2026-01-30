import api from './api';

export const getPendingSHGs = async () => {
    const response = await api.get('/admin/shgs/pending');
    return response.data;
};

export const approveSHG = async (id) => {
    const response = await api.put(`/admin/shgs/${id}/approve`);
    return response.data;
};

export const rejectSHG = async (id, reason) => {
    const response = await api.put(`/admin/shgs/${id}/reject`, { reason });
    return response.data;
};

export const getPendingProducts = async () => {
    const response = await api.get('/admin/products/pending');
    return response.data;
};

export const approveProduct = async (id) => {
    const response = await api.put(`/admin/products/${id}/approve`);
    return response.data;
};

export const getAllOrders = async () => {
    const response = await api.get('/admin/orders');
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
};

export const manageUserStatus = async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
};
