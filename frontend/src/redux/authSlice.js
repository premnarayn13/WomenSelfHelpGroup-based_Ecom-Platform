import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = (() => {
    try {
        const item = localStorage.getItem('userInfo');
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error parsing userInfo from localStorage', error);
        localStorage.removeItem('userInfo');
        return null;
    }
})();

const initialState = {
    userInfo: userFromStorage,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            state.loading = false;
            state.error = null;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        loginFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.userInfo = null;
            state.error = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('cartItems');
        },
        registerRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        registerFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileSuccess: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        },
    },
});

export const {
    setCredentials,
    loginRequest,
    loginSuccess,
    loginFail,
    logout,
    registerRequest,
    registerSuccess,
    registerFail,
    updateProfileSuccess,
} = authSlice.actions;

export default authSlice.reducer;
