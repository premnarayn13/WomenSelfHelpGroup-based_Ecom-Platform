import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    filters: {
        category: '',
        search: '',
        minPrice: '',
        maxPrice: '',
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProductsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
        fetchProductsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchProductRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProductSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload;
        },
        fetchProductFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                search: '',
                minPrice: '',
                maxPrice: '',
            };
        },
    },
});

export const {
    fetchProductsRequest,
    fetchProductsSuccess,
    fetchProductsFail,
    fetchProductRequest,
    fetchProductSuccess,
    fetchProductFail,
    setFilters,
    clearFilters,
} = productSlice.actions;

export default productSlice.reducer;
