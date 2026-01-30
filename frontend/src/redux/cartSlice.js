import { createSlice } from '@reduxjs/toolkit';

const getFromStorage = (key, defaultVal) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage`, error);
        return defaultVal;
    }
};

const initialState = {
    cartItems: getFromStorage('cartItems', []),
    shippingAddress: getFromStorage('shippingAddress', {}),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems.push(item);
            }

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        updateCartItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find((x) => x._id === id);
            if (item) {
                item.quantity = quantity;
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    saveShippingAddress,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
