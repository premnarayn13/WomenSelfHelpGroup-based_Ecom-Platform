import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        createOrderRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        createOrderSuccess: (state, action) => {
            state.loading = false;
            state.order = action.payload;
        },
        createOrderFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchOrdersRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchOrdersSuccess: (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        },
        fetchOrdersFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchOrderRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchOrderSuccess: (state, action) => {
            state.loading = false;
            state.order = action.payload;
        },
        fetchOrderFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    createOrderRequest,
    createOrderSuccess,
    createOrderFail,
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFail,
    fetchOrderRequest,
    fetchOrderSuccess,
    fetchOrderFail,
} = orderSlice.actions;

export default orderSlice.reducer;
